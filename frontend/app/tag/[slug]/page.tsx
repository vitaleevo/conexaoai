import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/layout/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { api } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

const PAGE_SIZE = 12;

export async function generateStaticParams() {
  const tags = await api.tags.list().catch(() => []);
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tags = await api.tags.list().catch(() => []);
  const tag = tags.find((item) => item.slug === slug);

  if (!tag) return {};

  return {
    title: `Posts tagged with: ${tag.name}`,
    description: `Explore all our articles marked with ${tag.name}. Direct insights on AI and technology.`,
    alternates: {
      canonical: absoluteUrl(`/tag/${tag.slug}`),
    },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const [tags, posts] = await Promise.all([
    api.tags.list().catch(() => []),
    api.tags.bySlug(slug, `page=${currentPage}&page_size=${PAGE_SIZE}`).catch(() => null),
  ]);
  const tag = tags.find((item) => item.slug === slug);

  if (!tag || !posts) notFound();

  const totalPages = Math.ceil(posts.count / PAGE_SIZE);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
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
        name: `Tag: ${tag.name}`,
        item: absoluteUrl(`/tag/${tag.slug}`),
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <JsonLd data={breadcrumbSchema} />
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
            <BreadcrumbPage>Tag: {tag.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="max-w-3xl space-y-4">
        <Badge variant="secondary" className="uppercase tracking-[0.16em]">
          Tag
        </Badge>
        <h1 className="font-display text-5xl leading-[0.98] text-foreground">{tag.name}</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Showing all posts marked with &quot;{tag.name}&quot;
        </p>
      </section>
      <Separator />
      <section className="space-y-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/tag/${slug}`}
        />
      </section>
    </div>
  );
}
