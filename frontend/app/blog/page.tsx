import Link from "next/link";

import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { api } from "@/lib/api";
import { editorialPillars } from "@/lib/site";

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    api.posts
      .list("page_size=12")
      .catch(
        () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.list>>,
      ),
    api.categories.list().catch(() => []),
  ]);
  const topicLinks = categories.length
    ? categories.slice(0, 5).map((category) => ({
        href: `/category/${category.slug}`,
        label: category.name,
      }))
    : editorialPillars.map((pillar) => ({ href: pillar.href, label: pillar.label }));

  return (
    <>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-14">
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Blog
            </p>
            <h1 className="font-display text-5xl leading-[0.96] text-[var(--foreground)] sm:text-6xl">
              Clear editorial structure for people building with AI.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
              Every post is designed to be easy to scan in five seconds, then rich enough to keep
              serious readers engaged to the end.
            </p>
          </div>
          <SearchForm buttonLabel="Search" variant="page" />
          <div className="flex flex-wrap gap-3">
            {topicLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-white hover:text-[var(--foreground)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        {posts.results.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--line)] bg-white p-6 text-sm leading-7 text-[var(--muted)]">
            No published posts yet. Once content is live, this page becomes the primary editorial
            archive.
          </div>
        )}
      </section>
    </>
  );
}
