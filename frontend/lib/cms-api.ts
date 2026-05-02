import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type CmsFetchOptions = RequestInit & { headers?: Record<string, string> };
type CmsPostPayload = Record<string, unknown>;

function parseEndpoint(endpoint: string) {
  const [path, query = ""] = endpoint.replace(/^\/+/, "").split("?");
  return { parts: path.split("/").filter(Boolean), query: new URLSearchParams(query) };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Session expired. Please log in again.");
  return data.user;
}

async function readBody(options?: CmsFetchOptions) {
  if (!options?.body || options.body instanceof FormData) return {};
  return JSON.parse(String(options.body)) as Record<string, unknown>;
}

function postSelect() {
  return "*, author:authors(*), category:categories(*), post_tags(tags(*))";
}

function toCmsPost(row: Record<string, unknown>) {
  const category = row.category as { name?: string } | null;
  const author = row.author as { name?: string } | null;
  return {
    ...row,
    category: row.category_id,
    author: row.author_id,
    category_name: category?.name ?? null,
    author_name: author?.name ?? "",
  };
}

function normalizePostPayload(payload: CmsPostPayload) {
  const title = String(payload.title ?? "");
  return {
    ...payload,
    slug: payload.slug || slugify(title),
    category_id: payload.category || null,
    author_id: payload.author || null,
    category: undefined,
    author: undefined,
    reading_time: Math.max(1, Math.ceil(String(payload.content ?? "").split(/\s+/).filter(Boolean).length / 200)),
  };
}

async function getTable(name: string) {
  const { data, error } = await supabase.from(name).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function handleMedia(parts: string[], options?: CmsFetchOptions) {
  await requireUser();
  const method = options?.method ?? "GET";

  if (method === "GET") return getTable("media_assets");

  if (method === "POST" && options?.body instanceof FormData) {
    const file = options.body.get("file");
    if (!(file instanceof File)) throw new Error("No file provided.");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `library/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        file: publicUrl.publicUrl,
        storage_path: path,
        description: String(options.body.get("description") ?? file.name),
      })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  if (method === "DELETE" && parts[1]) {
    const id = Number(parts[1]);
    const { data: asset } = await supabase.from("media_assets").select("storage_path").eq("id", id).single();
    if (asset?.storage_path) await supabase.storage.from("media").remove([asset.storage_path]);
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) throw error;
    return {};
  }

  throw new Error("Unsupported media operation.");
}

async function handlePosts(parts: string[], query: URLSearchParams, options?: CmsFetchOptions) {
  await requireUser();
  const method = options?.method ?? "GET";

  if (parts[1] === "activity") {
    const { data, error } = await supabase.from("posts").select("created_at").order("created_at");
    if (error) throw error;
    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const date = String(row.created_at).slice(0, 10);
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
  }

  if (method === "GET" && parts[1]) {
    const { data, error } = await supabase.from("posts").select(postSelect()).eq("id", Number(parts[1])).single();
    if (error) throw error;
    return toCmsPost(data as unknown as Record<string, unknown>);
  }

  if (method === "GET") {
    const page = Number(query.get("page") ?? "1") || 1;
    const pageSize = Number(query.get("page_size") ?? "15") || 15;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let builder = supabase
      .from("posts")
      .select(postSelect(), { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (query.get("status")) builder = builder.eq("status", query.get("status"));
    if (query.get("search")) {
      const search = query.get("search");
      builder = builder.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error, count } = await builder;
    if (error) throw error;
    return {
      count: count ?? 0,
      next: null,
      previous: null,
      results: ((data ?? []) as unknown as Record<string, unknown>[]).map(toCmsPost),
    };
  }

  if (method === "POST") {
    const payload = normalizePostPayload(await readBody(options));
    const { data, error } = await supabase.from("posts").insert(payload).select(postSelect()).single();
    if (error) throw error;
    return toCmsPost(data as unknown as Record<string, unknown>);
  }

  if ((method === "PATCH" || method === "PUT") && parts[1]) {
    const payload = normalizePostPayload(await readBody(options));
    const { data, error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", Number(parts[1]))
      .select(postSelect())
      .single();
    if (error) throw error;
    return toCmsPost(data as unknown as Record<string, unknown>);
  }

  if (method === "DELETE" && parts[1]) {
    const { error } = await supabase.from("posts").delete().eq("id", Number(parts[1]));
    if (error) throw error;
    return {};
  }

  throw new Error("Unsupported posts operation.");
}

export function getCmsToken() {
  return null;
}

export function setCmsTokens() {
  return undefined;
}

export async function clearCmsTokens() {
  await supabase.auth.signOut();
}

export async function cmsFetch<T>(endpoint: string, options?: CmsFetchOptions): Promise<T> {
  const { parts, query } = parseEndpoint(endpoint);
  const resource = parts[0];
  const method = options?.method ?? "GET";

  if (resource !== "track-click") await requireUser();

  if (resource === "me") {
    const user = await requireUser();
    return {
      id: user.id,
      username: user.email,
      email: user.email,
      first_name: user.user_metadata?.first_name ?? "",
      last_name: user.user_metadata?.last_name ?? "",
      is_staff: true,
      is_superuser: false,
      role: "editor",
    } as T;
  }

  if (resource === "stats") {
    const [posts, categories, tags, subscribers, media] = await Promise.all([
      supabase.from("posts").select("id,status,created_at,title,published_at,author:authors(name),category:categories(name)", { count: "exact" }).limit(5).order("created_at", { ascending: false }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("tags").select("id", { count: "exact", head: true }),
      supabase.from("subscribers").select("id,is_active,confirmed", { count: "exact" }),
      supabase.from("media_assets").select("id", { count: "exact", head: true }),
    ]);
    const postRows = (posts.data ?? []) as unknown as Record<string, unknown>[];
    return {
      posts: {
        total: posts.count ?? 0,
        published: postRows.filter((p) => p.status === "published").length,
        draft: postRows.filter((p) => p.status === "draft").length,
        scheduled: postRows.filter((p) => p.status === "scheduled").length,
        review: postRows.filter((p) => p.status === "review").length,
      },
      categories: { total: categories.count ?? 0, active: categories.count ?? 0 },
      tags: { total: tags.count ?? 0 },
      subscribers: {
        total: subscribers.count ?? 0,
        active: (subscribers.data ?? []).filter((s) => s.is_active && s.confirmed).length,
      },
      media: { total: media.count ?? 0 },
      recent_posts: postRows.map(toCmsPost),
    } as T;
  }

  if (resource === "posts") return handlePosts(parts, query, options) as Promise<T>;
  if (resource === "media") return handleMedia(parts, options) as Promise<T>;

  if (resource === "click-stats") {
    const path = query.get("path") ?? "/";
    const { data, error } = await supabase
      .from("click_events")
      .select("x_percent,y_percent")
      .eq("path", path)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    return (data ?? []) as T;
  }

  if (resource === "track-click") {
    const payload = await readBody(options);
    const { error } = await supabase.from("click_events").insert(payload);
    if (error) throw error;
    return {} as T;
  }

  const tableMap: Record<string, string> = {
    categories: "categories",
    tags: "tags",
    authors: "authors",
    newsletter: "subscribers",
  };
  const table = tableMap[resource];
  if (!table) throw new Error(`Unsupported CMS endpoint: ${endpoint}`);

  if (method === "GET") {
    if (resource === "newsletter") {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      return data as T;
    }

    const rows = await getTable(table);
    if (resource === "authors") {
      return rows.map((row) => ({ ...row, user: { username: row.name || row.email } })) as T;
    }
    return rows as T;
  }

  if (method === "POST") {
    const payload = await readBody(options);
    if (!payload.slug && typeof payload.name === "string") payload.slug = slugify(payload.name);
    const { data, error } = await supabase.from(table).insert(payload).select("*").single();
    if (error) throw error;
    return data as T;
  }

  throw new Error(`Unsupported operation for ${endpoint}`);
}
