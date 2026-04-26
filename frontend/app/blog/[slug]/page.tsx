import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleToc } from "@/components/blog/ArticleToc";
import { PostBody } from "@/components/blog/PostBody";
import { PostMeta } from "@/components/blog/PostMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/JsonLd";
import { api } from "@/lib/api";
import { absoluteUrl, buildArticleContentModel, extractFaqFromHtml } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await api.posts.slugs().catch(() => []);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.posts.bySlug(slug).catch(() => null);
  if (!post) return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: post.canonical_url || absoluteUrl(`/blog/${post.slug}`),
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author.name],
      images: [
        {
          url: post.og_image || post.featured_image,
          alt: post.featured_image_alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [post.og_image || post.featured_image],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    api.posts.bySlug(slug).catch(() => null),
    api.posts.related(slug).catch(() => []),
  ]);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.website,
      jobTitle: post.author.credentials,
      sameAs: [
        post.author.twitter ? `https://twitter.com/${post.author.twitter}` : null,
        post.author.linkedin,
        post.author.website,
      ].filter(Boolean),
    },
    image: post.featured_image,
    publisher: {
      "@type": "Organization",
      name: "Conexao AI",
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-full.png") },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keywords,
  };
  const article = buildArticleContentModel(post.content);
  const faqItems = extractFaqFromHtml(article.html);
  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-12">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              {post.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/category/${post.category.slug}`}>
                      {post.category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {post.category ? (
                <Link href={`/category/${post.category.slug}`}>
                  <Badge variant="secondary">
                    {post.category.name}
                  </Badge>
                </Link>
              ) : null}
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Article</span>
            </div>
            <h1 className="font-display text-4xl leading-[0.95] text-foreground sm:text-6xl transition-colors duration-500 ease-in-out hover:text-primary cursor-default">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="max-w-3xl text-xl leading-9 text-muted-foreground">{post.excerpt}</p>
            ) : null}
            <PostMeta post={post} />
          </div>

          {post.featured_image ? (
            <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={post.featured_image}
                alt={post.featured_image_alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : null}
        </div>
        <Separator />
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl space-y-8">
            {article.headings.length ? (
              <div className="xl:hidden">
                <ArticleToc headings={article.headings} />
              </div>
            ) : null}

            {post.excerpt ? (
              <Card className="bg-muted/50 border-none shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    In brief
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-8 text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ) : null}

            <PostBody html={article.html} />

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Next step
                </CardTitle>
                <h2 className="font-display mt-3 text-4xl leading-none text-foreground">
                  Get the next practical breakdown.
                </h2>
                <CardDescription className="mt-3 max-w-2xl text-base leading-8">
                  Join the newsletter for weekly analysis on AI, tools, business leverage and
                  operating systems designed for people who prefer clarity over noise.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Link href="/newsletter">
                  <Button className="px-8">Join newsletter</Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="px-8">Read more insights</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <aside className="hidden xl:flex xl:flex-col xl:gap-6">
            <ArticleToc headings={article.headings} />
            <Card className="bg-muted/50 border-none shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Stay close
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">
                  Weekly analysis on AI, business systems and tools with a clean editorial format and
                  high information density.
                </p>
                <Link href="/newsletter">
                  <Button className="mt-4 w-full">Join newsletter</Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-background">
          <Separator />
          <div className="mx-auto w-full max-w-7xl px-6 py-12">
            <RelatedPosts posts={related} />
          </div>
        </section>
      ) : null}
    </>
  );
}
