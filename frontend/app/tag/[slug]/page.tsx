import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/PostCard";
import { api } from "@/lib/api";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tags, posts] = await Promise.all([
    api.tags.list().catch(() => []),
    api.tags.bySlug(slug).catch(() => null),
  ]);
  const tag = tags.find((item) => item.slug === slug);

  if (!tag || !posts) notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">Tag</p>
        <h1 className="font-display text-5xl leading-[0.98]">{tag.name}</h1>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
