import type { MetadataRoute } from "next";

import { api } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conexao.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    api.posts
      .list("page_size=1000")
      .catch(
        () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.list>>,
      ),
    api.categories.list().catch(() => []),
    api.tags.list().catch(() => []),
  ]);

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/newsletter`, changeFrequency: "monthly", priority: 0.6 },
    ...categories.map((cat) => ({
      url: `${BASE}/category/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tags.map((tag) => ({
      url: `${BASE}/tag/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.results.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
