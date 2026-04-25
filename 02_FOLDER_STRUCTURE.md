# Conexao AI — Folder Structure

## Backend — Django

```
conexao_ai_backend/
├── config/
│   ├── settings/
│   │   ├── base.py           # Shared settings
│   │   ├── development.py    # SQLite, DEBUG=True, CORS open
│   │   └── production.py     # PostgreSQL, security headers, whitenoise
│   ├── urls.py               # Root URL config
│   └── wsgi.py
│
├── apps/
│   ├── blog/
│   │   ├── models.py         # Post, Category, Tag, Author
│   │   ├── serializers.py    # DRF serializers (list + detail)
│   │   ├── views.py          # ListAPIView, RetrieveAPIView, RelatedPosts
│   │   ├── urls.py           # /api/posts/, /api/categories/, /api/tags/
│   │   ├── admin.py          # Customized Django admin with rich text
│   │   └── filters.py        # DjangoFilterBackend filter classes
│   │
│   ├── accounts/
│   │   ├── models.py         # Author profile (OneToOne to User)
│   │   ├── serializers.py
│   │   └── views.py          # JWT token endpoints
│   │
│   └── newsletter/
│       ├── models.py         # Subscriber model
│       ├── serializers.py
│       └── views.py          # Subscribe, confirm, unsubscribe
│
├── media/                    # Local dev uploads (Cloudinary in prod)
├── static/                   # Collected static files
├── manage.py
├── requirements.txt
├── Dockerfile
├── railway.toml              # Railway deploy config
└── .env.example
```

## Frontend — Next.js 16

```
conexao_ai_frontend/
├── app/
│   ├── layout.tsx            # Root layout: fonts, header, footer, metadata
│   ├── page.tsx              # Home page (ISR, revalidate 60s)
│   ├── sitemap.ts            # Dynamic sitemap.xml
│   ├── robots.ts             # robots.txt
│   │
│   ├── blog/
│   │   ├── page.tsx          # Blog listing (ISR)
│   │   └── [slug]/
│   │       ├── page.tsx      # Post page (SSG + JSON-LD)
│   │       └── loading.tsx   # Skeleton loader
│   │
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx      # Category archive (SSG)
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── newsletter/
│   │   └── page.tsx
│   │
│   └── not-found.tsx         # Custom 404
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Spinner.tsx
│   │
│   ├── blog/
│   │   ├── PostCard.tsx      # Card for listing pages
│   │   ├── PostBody.tsx      # Rendered HTML content
│   │   ├── FeaturedPost.tsx  # Hero post component
│   │   ├── RelatedPosts.tsx  # Related posts grid
│   │   └── PostMeta.tsx      # Author, date, read time
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Nav.tsx
│   │   └── Breadcrumb.tsx
│   │
│   └── seo/
│       ├── JsonLd.tsx        # JSON-LD structured data injector
│       └── OpenGraph.tsx
│
├── lib/
│   ├── api.ts                # Typed API client (all fetch calls)
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # formatDate, truncate, readingTime
│
├── public/
│   └── og-default.png        # Default OG image
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

## Environment Files

### Backend — `.env.example`
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Switch to PostgreSQL in production:
# DATABASE_URL=postgresql://user:pass@host/db

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ALLOWED_ORIGINS=http://localhost:3000

JWT_SECRET_KEY=your-jwt-secret
```

### Frontend — `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=https://conexao.ai
NEXT_PUBLIC_SITE_NAME=Conexao AI
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
