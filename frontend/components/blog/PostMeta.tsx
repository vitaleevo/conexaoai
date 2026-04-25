import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
      <span>{post.author.name}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
      <span>{formatDate(post.published_at)}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--line)]" />
      <span>{post.reading_time} min read</span>
    </div>
  );
}
