import type { Category, PaginatedResponse, Post, SubscriberResponse, Tag } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:8000/api" : "");

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number },
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const { revalidate = 60, ...rest } = options ?? {};
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    ...(revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" }),
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${endpoint}`);
  }

  return response.json();
}

export const api = {
  posts: {
    list: (params = "", options?: RequestInit & { revalidate?: number }) =>
      apiFetch<PaginatedResponse<Post>>(`/posts/${params ? `?${params}` : ""}`, options),
    bySlug: (slug: string) => apiFetch<Post>(`/posts/${slug}/`, { revalidate: 3600 }),
    related: (slug: string) => apiFetch<Post[]>(`/posts/${slug}/related/`, { revalidate: 3600 }),
    featured: () =>
      apiFetch<PaginatedResponse<Post>>("/posts/?is_featured=true&page_size=3"),
    slugs: () => apiFetch<{ slug: string }[]>("/posts/slugs/", { revalidate: 300 }),
  },
  categories: {
    list: () => apiFetch<Category[]>("/categories/"),
    bySlug: (slug: string, params = "") =>
      apiFetch<PaginatedResponse<Post>>(`/posts/?category__slug=${slug}${params ? `&${params}` : ""}`),
  },
  tags: {
    list: () => apiFetch<Tag[]>("/tags/"),
    bySlug: (slug: string, params = "") =>
      apiFetch<PaginatedResponse<Post>>(`/posts/?tags__slug=${slug}${params ? `&${params}` : ""}`),
  },
  newsletter: {
    subscribe: (data: { email: string; name?: string; region?: string }) =>
      apiFetch<SubscriberResponse>("/newsletter/subscribe/", {
        method: "POST",
        body: JSON.stringify(data),
        revalidate: 0,
      }),
  },
};
