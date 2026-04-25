
# Conexao AI — Architecture Overview

## Project Goal

Build a high-performance, SEO-optimized, scalable blog and content platform focused on:

- AI tools
- Automation
- Making money online
- Digital systems

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Frontend | Next.js 15 (App Router) |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Media | Cloudinary |
| Auth | JWT via SimpleJWT |
| Hosting (backend) | Railway or Render |
| Hosting (frontend) | Vercel |
| CDN | Vercel Edge + Cloudflare |

---

## System Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│              CDN / Edge Layer                        │
│         Vercel Edge + Cloudflare                     │
│   Static Assets │ Edge Caching │ DDoS Protection     │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│           Frontend Layer — Next.js 15 (Vercel)       │
│     SSG Pages │ ISR Pages │ SSR Pages                │
│  Blog posts   │  Home/Listing │  Search              │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS REST API
┌───────────────────────▼─────────────────────────────┐
│         API Layer — Django REST Framework            │
│  Public Endpoints │ Protected Endpoints │ Webhooks   │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│       Backend Layer — Django (Railway/Render)        │
│     blog app │ accounts app │ newsletter app         │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                  Data Layer                          │
│    SQLite/PostgreSQL │ Cloudinary │ Redis (future)   │
└─────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

1. **API-first** — Next.js never touches the database directly. All data flows through DRF endpoints.
2. **SSG by default** — Blog posts are statically generated at build time. ISR handles updates without redeploys.
3. **Decoupled** — Backend and frontend deploy independently and can be scaled or swapped separately.
4. **Django Admin as CMS** — No external headless CMS dependency. The built-in admin, customized, covers all content management needs.
5. **SQLite → PostgreSQL** — Zero code change required. A single environment variable switches the database engine.
6. **Modular Django apps** — Each feature domain (`blog`, `accounts`, `newsletter`) is its own Django app, ready for future extraction into microservices.

---

## Rendering Strategy

| Page | Strategy | Revalidate |
|---|---|---|
| `/` Home | ISR | 60s |
| `/blog` Listing | ISR | 60s |
| `/blog/[slug]` Post | SSG | At build / on-demand |
| `/category/[slug]` | SSG | At build |
| `/search` | SSR | Always fresh |
| `/newsletter` | Static | — |

---

## Scaling Roadmap

### Phase 1 — Launch (0–10k visitors/mo)
- Django + SQLite → PostgreSQL on Railway
- Next.js on Vercel hobby plan
- Cloudinary free tier for media
- Django Admin as full CMS

### Phase 2 — Growth (10k–100k visitors/mo)
- Redis for API response caching
- Celery for async newsletter jobs
- Dedicated PostgreSQL on Neon.tech
- Sentry + Posthog monitoring
- Algolia or DRF search upgrade

### Phase 3 — Scale (100k+ visitors/mo)
- Separate Django apps into microservices
- PostgreSQL read replicas
- Elasticsearch for full-text search
- Cloudflare Workers for edge API caching
- A/B testing infrastructure
- SaaS product launch alongside blog