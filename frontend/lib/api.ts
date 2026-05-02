import type { Category, PaginatedResponse, Post, SubscriberResponse, Tag } from "./types";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabase-server";
import { getPostSelect, normalizePost } from "./supabase-mappers";

const PAGE_SIZE = 12;

function getRange(page = 1, pageSize = PAGE_SIZE) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

function parseParams(params: string) {
  return new URLSearchParams(params.startsWith("?") ? params.slice(1) : params);
}

async function listPosts(params = ""): Promise<PaginatedResponse<Post>> {
  if (!isSupabaseConfigured()) {
    return { count: 0, next: null, previous: null, results: [] };
  }

  const supabase = createSupabaseServerClient();
  const searchParams = parseParams(params);
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const pageSize = Number(searchParams.get("page_size") ?? PAGE_SIZE) || PAGE_SIZE;
  const { from, to } = getRange(page, pageSize);

  let query = supabase
    .from("posts")
    .select(getPostSelect(), { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  const search = searchParams.get("search");
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (searchParams.get("is_featured")) {
    query = query.eq("is_featured", searchParams.get("is_featured") === "true");
  }

  if (searchParams.get("category__slug")) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.get("category__slug"))
      .single();
    query = category ? query.eq("category_id", category.id) : query.eq("category_id", -1);
  }

  if (searchParams.get("tags__slug")) {
    const { data: tagRows } = await supabase
      .from("tags")
      .select("id, post_tags(post_id)")
      .eq("slug", searchParams.get("tags__slug"));
    const postIds = tagRows?.flatMap((tag) => tag.post_tags.map((item) => item.post_id)) ?? [];
    query = postIds.length ? query.in("id", postIds) : query.eq("id", -1);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    count: count ?? 0,
    next: null,
    previous: null,
    results: ((data ?? []) as unknown as Record<string, unknown>[]).map(normalizePost),
  };
}

export const api = {
  posts: {
    list: listPosts,
    bySlug: async (slug: string) => {
      if (!isSupabaseConfigured()) throw new Error(`Supabase is not configured for post ${slug}.`);
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("posts")
        .select(getPostSelect())
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return normalizePost(data as unknown as Record<string, unknown>);
    },
    related: async (slug: string) => {
      const current = await api.posts.bySlug(slug);
      if (!current.category?.id) return [];
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("posts")
        .select(getPostSelect())
        .eq("status", "published")
        .eq("category_id", current.category.id)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return ((data ?? []) as unknown as Record<string, unknown>[]).map(normalizePost);
    },
    featured: () => listPosts("is_featured=true&page_size=3"),
    slugs: async () => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("posts").select("slug").eq("status", "published");
      if (error) throw error;
      return data ?? [];
    },
  },
  categories: {
    list: async () => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
    bySlug: (slug: string, params = "") => listPosts(`category__slug=${slug}${params ? `&${params}` : ""}`),
  },
  tags: {
    list: async () => {
      if (!isSupabaseConfigured()) return [];
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Tag[];
    },
    bySlug: (slug: string, params = "") => listPosts(`tags__slug=${slug}${params ? `&${params}` : ""}`),
  },
  newsletter: {
    subscribe: async (data: { email: string; name?: string; region?: string }) => {
      if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
      const supabase = createSupabaseServerClient();
      const { data: row, error } = await supabase
        .from("subscribers")
        .upsert({ ...data, region: data.region ?? "global", is_active: true }, { onConflict: "email" })
        .select("*")
        .single();
      if (error) throw error;
      return row as SubscriberResponse;
    },
  },
};
