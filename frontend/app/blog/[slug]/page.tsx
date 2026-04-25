import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleToc } from "@/components/blog/ArticleToc";
import { PostBody } from "@/components/blog/PostBody";
import { PostMeta } from "@/components/blog/PostMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { api } from "@/lib/api";
import { absoluteUrl, buildArticleContentModel, extractFaqFromHtml } from "@/lib/utils";

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
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-12">
          <Breadcrumb
            items={[
              { href: "/", label: "Inicio" },
              { href: "/blog", label: "Blog" },
              ...(post.category ? [{ href: `/category/${post.category.slug}`, label: post.category.name }] : []),
              { label: post.title },
            ]}
          />

          <div className="mt-8 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {post.category ? (
                <Link
                  className="rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-[var(--accent-strong)]"
                  href={`/category/${post.category.slug}`}
                >
                  {post.category.name}
                </Link>
              ) : null}
              <span>Article</span>
            </div>
            <h1 className="font-display text-5xl leading-[0.95] text-[var(--foreground)] sm:text-6xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="max-w-3xl text-xl leading-9 text-[var(--muted)]">{post.excerpt}</p>
            ) : null}
            <PostMeta post={post} />
          </div>

          {post.featured_image ? (
            <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
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
              <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  In brief
                </p>
                <p className="mt-3 text-base leading-8 text-[var(--muted)]">{post.excerpt}</p>
              </section>
            ) : null}

            <PostBody html={article.html} />

            <section className="rounded-lg border border-[var(--line)] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Next step
              </p>
              <h2 className="font-display mt-3 text-4xl leading-none text-[var(--foreground)]">
                Get the next practical breakdown.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--muted)]">
                Join the newsletter for weekly analysis on AI, tools, business leverage and
                operating systems designed for people who prefer clarity over noise.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                  href="/newsletter"
                >
                  Join newsletter
                </Link>
                <Link
                  className="inline-flex rounded-lg border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface)]"
                  href="/blog"
                >
                  Read more insights
                </Link>
              </div>
            </section>
          </div>

          <aside className="hidden xl:flex xl:flex-col xl:gap-6">
            <ArticleToc headings={article.headings} />
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Stay close
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Weekly analysis on AI, business systems and tools with a clean editorial format and
                high information density.
              </p>
              <Link
                className="mt-4 inline-flex rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                href="/newsletter"
              >
                Join newsletter
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-[var(--line)] bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-12">
            <RelatedPosts posts={related} />
          </div>
        </section>
      ) : null}
    </>
  );
}
