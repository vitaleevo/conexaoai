import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PostCard } from "@/components/blog/PostCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { api } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await api.categories.list().catch(() => []);
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await api.categories.list().catch(() => []);
  const category = categories.find((item) => item.slug === slug);

  if (!category) return {};

  return {
    title: category.meta_title || category.name,
    description: category.meta_description || category.description,
    alternates: {
      canonical: absoluteUrl(`/category/${category.slug}`),
    },
    openGraph: {
      title: category.meta_title || category.name,
      description: category.meta_description || category.description,
      url: absoluteUrl(`/category/${category.slug}`),
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, posts] = await Promise.all([
    api.categories.list().catch(() => []),
    api.categories.bySlug(slug).catch(() => null),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category || !posts) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: absoluteUrl(`/category/${category.slug}`),
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { href: "/blog", label: "Blog" },
          { label: category.name },
        ]}
      />
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">Categoria</p>
        <h1 className="font-display text-5xl leading-[0.98]">{category.name}</h1>
        <p className="text-lg leading-8 text-[var(--muted)]">{category.description}</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
