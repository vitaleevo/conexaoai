import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { Pagination } from "@/components/layout/Pagination";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = q.trim();

  return {
    title: query ? `Search: ${query}` : "Search",
    description: "Search for AI insights and analysis on the Conexão AI blog.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  if (!q) {
    redirect("/blog");
  }

  const posts = await api.posts
    .list(`search=${encodeURIComponent(q)}&page=${currentPage}&page_size=${PAGE_SIZE}`)
    .catch(() => ({ count: 0, results: [] }) as any);

  const totalPages = Math.ceil(posts.count / PAGE_SIZE);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Results</p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchForm defaultValue={q} buttonLabel="Search again" variant="page" />
      </section>

      <Separator />

      <section className="space-y-12">
        {posts.results && posts.results.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.results.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/search?q=${encodeURIComponent(q)}`}
            />
          </>
        ) : (
          <div className="rounded-lg border border-border bg-background p-10 text-center">
            <p className="text-lg text-muted-foreground">
              We couldn&apos;t find any articles matching your search. Try different terms or browse the main archive.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
