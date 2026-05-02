import type { Author, Category, Post, Tag } from "./types";

type RawPost = Record<string, unknown> & {
  author?: Partial<Author> | null;
  category?: Partial<Category> | null;
  post_tags?: Array<{ tags?: Partial<Tag> | null }> | null;
};

export function normalizePost(row: RawPost | Record<string, unknown>): Post {
  const raw = row as RawPost;
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ""),
    slug: String(raw.slug ?? ""),
    excerpt: String(raw.excerpt ?? ""),
    content: String(raw.content ?? ""),
    featured_image: String(raw.featured_image ?? ""),
    featured_image_alt: String(raw.featured_image_alt ?? ""),
    author: {
      name: raw.author?.name ?? "",
      email: raw.author?.email ?? "",
      bio: raw.author?.bio ?? "",
      avatar: raw.author?.avatar ?? "",
      website: raw.author?.website ?? "",
      twitter: raw.author?.twitter ?? "",
      linkedin: raw.author?.linkedin ?? "",
      credentials: raw.author?.credentials ?? "",
    },
    category: raw.category
      ? {
          id: Number(raw.category.id),
          name: raw.category.name ?? "",
          slug: raw.category.slug ?? "",
          description: raw.category.description ?? "",
          post_count: Number(raw.category.post_count ?? 0),
          meta_title: raw.category.meta_title ?? "",
          meta_description: raw.category.meta_description ?? "",
        }
      : (null as unknown as Category),
    tags: (raw.post_tags ?? [])
      .map((item) => item.tags)
      .filter(Boolean)
      .map((tag) => ({
        id: Number(tag?.id),
        name: tag?.name ?? "",
        slug: tag?.slug ?? "",
        post_count: Number(tag?.post_count ?? 0),
      })),
    published_at: String(raw.published_at ?? raw.created_at ?? ""),
    reading_time: Number(raw.reading_time ?? 1),
    is_featured: Boolean(raw.is_featured),
    region: (raw.region as Post["region"]) ?? "global",
    meta_title: String(raw.meta_title ?? ""),
    meta_description: String(raw.meta_description ?? ""),
    keywords: String(raw.keywords ?? ""),
    canonical_url: String(raw.canonical_url ?? ""),
    og_image: String(raw.og_image ?? ""),
    updated_at: String(raw.updated_at ?? ""),
  };
}

export function getPostSelect() {
  return `
    *,
    author:authors(*),
    category:categories(*),
    post_tags(tags(*))
  `;
}
