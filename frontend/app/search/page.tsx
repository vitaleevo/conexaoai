import type { Metadata } from "next";
import Link from "next/link";

import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { absoluteUrl } from "@/lib/utils";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = q.trim();

  return {
    title: query ? `Busca: ${query}` : "Buscar",
    description: query
      ? `Resultados de busca por ${query} no Conexao AI.`
      : "Busque artigos sobre IA, automação, sistemas digitais e monetização.",
    alternates: {
      canonical: query ? absoluteUrl(`/search?q=${encodeURIComponent(query)}`) : absoluteUrl("/search"),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query
    ? await api.posts
        .list(`search=${encodeURIComponent(query)}&page_size=12`, { revalidate: 0 })
        .catch(() => ({
        count: 0,
        next: null,
        previous: null,
        results: [],
      }))
    : { count: 0, next: null, previous: null, results: [] };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">Search</p>
        <h1 className="font-display text-5xl leading-[0.98]">Find content by topic and intent.</h1>
        <p className="text-lg leading-8 text-[var(--muted)]">
          Search across AI, business systems, tools, monetization, guides and operating playbooks.
        </p>
      </section>

      <SearchForm
        buttonLabel="Search"
        defaultValue={query}
        placeholder="Try: chatgpt, automation, affiliates, prompts..."
        variant="page"
      />

      {query ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              {results.count} result{results.count === 1 ? "" : "s"} for &quot;{query}&quot;
            </h2>
            <Link className="text-sm font-semibold text-[var(--accent-strong)]" href="/blog">
              View all articles
            </Link>
          </div>
          {results.results.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
              No article matched this search. Try a broader term or browse the main archive.
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          Type a term to search the published content.
        </div>
      )}
    </div>
  );
}
