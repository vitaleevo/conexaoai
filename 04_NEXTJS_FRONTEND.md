# Conexao AI — Next.js Frontend

## Installation

```bash
cd conexao_ai_frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
npm install
cp .env.local.example .env.local   # Fill in API URL
npm run dev
```

---

## lib/types.ts

```typescript
export interface Author {
  name: string
  email: string
  bio: string
  avatar: string
  website: string
  twitter: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  post_count: number
  meta_title: string
  meta_description: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  post_count: number
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  featured_image_alt: string
  author: Author
  category: Category
  tags: Tag[]
  published_at: string
  reading_time: number
  is_featured: boolean
  meta_title: string
  meta_description: string
  keywords: string
  canonical_url: string
  og_image: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
```

---

## lib/api.ts

```typescript
import type { Post, Category, Tag, PaginatedResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number }
): Promise<T> {
  const { revalidate = 60, ...rest } = options ?? {}
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${endpoint}`)
  }

  return res.json()
}

export const api = {
  posts: {
    list: (params = '') =>
      apiFetch<PaginatedResponse<Post>>(`/posts/?${params}`),

    bySlug: (slug: string) =>
      apiFetch<Post>(`/posts/${slug}/`, { revalidate: 3600 }),

    related: (slug: string) =>
      apiFetch<Post[]>(`/posts/${slug}/related/`, { revalidate: 3600 }),

    featured: () =>
      apiFetch<PaginatedResponse<Post>>('/posts/?is_featured=true&page_size=3'),

    slugs: () =>
      apiFetch<{ slug: string }[]>('/posts/slugs/', { revalidate: 300 }),
  },

  categories: {
    list: () => apiFetch<Category[]>('/categories/'),
    bySlug: (slug: string) =>
      apiFetch<PaginatedResponse<Post>>(`/posts/?category__slug=${slug}`),
  },

  tags: {
    list: () => apiFetch<Tag[]>('/tags/'),
  },

  newsletter: {
    subscribe: (data: { email: string; name?: string }) =>
      apiFetch('/newsletter/subscribe/', {
        method: 'POST',
        body: JSON.stringify(data),
        revalidate: 0,
      }),
  },
}
```

---

## lib/utils.ts

```typescript
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexao.ai'
  return `${base}${path}`
}
```

---

## app/layout.tsx

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Conexao AI — Ferramentas, Automação e Renda Digital',
    template: '%s | Conexao AI',
  },
  description: 'Os melhores recursos sobre IA, automação e como ganhar dinheiro online.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexao.ai'),
  openGraph: {
    siteName: 'Conexao AI',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Conexao AI',
  url: 'https://conexao.ai',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://conexao.ai/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <JsonLd data={websiteSchema} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

## app/page.tsx — Home (ISR)

```typescript
import { api } from '@/lib/api'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterCTA } from '@/components/newsletter/NewsletterCTA'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    api.posts.featured(),
    api.posts.list('page_size=9'),
    api.categories.list(),
  ])

  return (
    <>
      {/* Hero */}
      {featured.results[0] && <FeaturedPost post={featured.results[0]} />}

      {/* Category navigation */}
      <section className="py-8 border-b">
        <div className="container mx-auto flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50 transition"
            >
              {cat.name} ({cat.post_count})
            </a>
          ))}
        </div>
      </section>

      {/* Latest posts grid */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-semibold mb-8">Últimos artigos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCTA />
    </>
  )
}
```

---

## app/blog/[slug]/page.tsx — Post (SSG)

```typescript
import { api } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostBody } from '@/components/blog/PostBody'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { PostMeta } from '@/components/blog/PostMeta'
import { absoluteUrl } from '@/lib/utils'

// SSG: generate all post pages at build time
export async function generateStaticParams() {
  const slugs = await api.posts.slugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// Dynamic SEO metadata per post
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await api.posts.bySlug(params.slug).catch(() => null)
  if (!post) return {}

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
      type: 'article',
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
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [post.og_image || post.featured_image],
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const [post, related] = await Promise.all([
    api.posts.bySlug(params.slug).catch(() => null),
    api.posts.related(params.slug).catch(() => []),
  ])

  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.website,
    },
    image: post.featured_image,
    publisher: {
      '@type': 'Organization',
      name: 'Conexao AI',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keywords,
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <article className="container mx-auto max-w-3xl py-12 px-4">
        <PostMeta post={post} />
        <PostBody post={post} />
      </article>
      {related.length > 0 && (
        <section className="container mx-auto py-12 border-t">
          <RelatedPosts posts={related} />
        </section>
      )}
    </>
  )
}
```

---

## app/sitemap.ts

```typescript
import { api } from '@/lib/api'
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexao.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    api.posts.list('page_size=1000'),
    api.categories.list(),
    api.tags.list(),
  ])

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/newsletter`, changeFrequency: 'monthly', priority: 0.6 },

    ...categories.map((cat) => ({
      url: `${BASE}/category/${cat.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    ...tags.map((tag) => ({
      url: `${BASE}/tag/${tag.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),

    ...posts.results.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
```

---

## app/robots.ts

```typescript
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conexao.ai'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
```

---

## components/seo/JsonLd.tsx

```typescript
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

---

## components/blog/PostCard.tsx

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col rounded-2xl border overflow-hidden hover:shadow-md transition">
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      )}
      <div className="flex flex-col flex-1 p-5">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2"
          >
            {post.category.name}
          </Link>
        )}
        <h3 className="font-semibold text-lg mb-2 leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(post.published_at)}</span>
          <span>{post.reading_time} min de leitura</span>
        </div>
      </div>
    </article>
  )
}
```

---

## next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Add permanent 301 redirects here if slugs ever change
    ]
  },
}

export default nextConfig
```
