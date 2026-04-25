import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-white transition hover:border-[rgba(37,99,235,0.24)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      {post.featured_image ? (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)] bg-[var(--surface)]">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {post.category ? (
            <Link
              href={`/category/${post.category.slug}`}
              className="rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-[var(--accent-strong)] transition hover:bg-[rgba(37,99,235,0.14)]"
            >
              {post.category.name}
            </Link>
          ) : null}
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3 className="font-display text-[1.65rem] leading-[1.12] text-[var(--foreground)]">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-[var(--accent)]">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-base leading-7 text-[var(--muted)]">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <span>{post.author.name}</span>
          <span>{post.reading_time} min read</span>
        </div>
      </div>
    </article>
  );
}
