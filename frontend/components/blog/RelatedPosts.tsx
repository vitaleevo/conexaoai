import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/lib/types";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
          Related
        </p>
        <h2 className="font-display text-4xl leading-none text-[var(--foreground)]">
          Continue reading
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
