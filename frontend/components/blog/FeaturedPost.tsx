import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Featured</Badge>
          {post.category ? (
            <Link
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]"
              href={`/category/${post.category.slug}`}
            >
              {post.category.name}
            </Link>
          ) : null}
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-4xl leading-[1.02] text-[var(--foreground)] sm:text-5xl">
            <Link className="transition hover:text-[var(--accent)]" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p className="text-base leading-8 text-[var(--muted)]">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <span>{post.author.name}</span>
          <span>{formatDate(post.published_at)}</span>
          <span>{post.reading_time} min read</span>
        </div>
        <Link
          className="inline-flex rounded-lg bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
          href={`/blog/${post.slug}`}
        >
          Read insight
        </Link>
      </div>
      <div className="relative min-h-56 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-end p-5 text-sm text-[var(--muted)]">Clear, dense, structured.</div>
        )}
      </div>
    </article>
  );
}
