import Link from "next/link";

import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { NewsletterCTA } from "@/components/newsletter/NewsletterCTA";
import { api } from "@/lib/api";
import { editorialPillars, homepageSignals } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    api.posts.featured().catch(
      () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.featured>>,
    ),
    api.posts.list("page_size=9").catch(
      () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.list>>,
    ),
    api.categories.list().catch(() => []),
  ]);
  const featuredPost = featured.results[0] ?? latest.results[0] ?? null;
  const latestPosts = latest.results.filter((post) => post.id !== featuredPost?.id).slice(0, 6);
  const categoryLinks = categories.length
    ? categories.slice(0, 5).map((category) => ({
        href: `/category/${category.slug}`,
        label: category.name,
        description: `${category.post_count} published article${category.post_count === 1 ? "" : "s"}`,
      }))
    : editorialPillars;

  return (
    <>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:py-20">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                Conexao AI
              </p>
              <h1 className="font-display text-5xl leading-[0.95] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                AI, Business & Systems for the Modern Internet
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                Direct insights, structured analysis and dense guides for teams that need to move
                fast without lowering their standards.
              </p>
            </div>
            <SearchForm
              buttonLabel="Read insights"
              placeholder="Search AI, tools, growth, automation and systems..."
              variant="hero"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {homepageSignals.map((signal) => (
                <div key={signal.title} className="border-t border-[var(--line)] pt-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{signal.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{signal.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:border-l lg:border-[var(--line)] lg:pl-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Featured insight
              </p>
              <Link className="text-sm font-semibold text-[var(--foreground)]" href="/blog">
                Browse all
              </Link>
            </div>
            {featuredPost ? (
              <FeaturedPost post={featuredPost} />
            ) : (
              <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 text-sm leading-7 text-[var(--muted)]">
                The editorial shell is ready. Once content is published, this space becomes the main
                featured story for new readers.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Editorial pillars
            </p>
            <h2 className="font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
              Built to be global, fast to scan and deep enough to trust.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {categoryLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-lg border border-[var(--line)] bg-white p-5 transition hover:border-[rgba(37,99,235,0.24)] hover:shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
                href={item.href}
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Latest
            </p>
            <h2 className="font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
              Recent articles worth the scroll
            </h2>
          </div>
          <Link className="text-sm font-semibold text-[var(--foreground)]" href="/blog">
            View all articles
          </Link>
        </div>
        {latestPosts.length ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-[var(--line)] bg-white p-6 text-sm leading-7 text-[var(--muted)]">
            No published articles yet. The layout is already optimized for a dense editorial feed.
          </div>
        )}
      </section>

      <NewsletterCTA />
    </>
  );
}
