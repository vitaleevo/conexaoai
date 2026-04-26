# Conexão AI

> AI, Business & Systems for the Modern Internet — A professional blog platform powered by Django REST Framework + Next.js.

## Architecture

| Layer | Tech | Deployment |
|-------|------|------------|
| **Backend** (API + CMS) | Django 5.2, DRF, PostgreSQL, Cloudinary | [Railway](https://railway.app) |
| **Frontend** (Blog + CMS UI) | Next.js 16, React 19, Tailwind CSS 4 | [Cloudflare Workers](https://developers.cloudflare.com/workers/) |
| **Media** | Cloudinary CDN | Cloudinary |

```
ConexãoAI/
├── backend/          # Django REST API + Admin
│   ├── apps/
│   │   ├── blog/     # Post, Category, Tag, Author models & public API
│   │   ├── cms/      # CMS API (CRUD, media, heatmaps)
│   │   ├── accounts/ # JWT authentication
│   │   └── newsletter/ # Subscriber management
│   └── config/       # Settings (base / development / production)
├── frontend/         # Next.js App Router
│   ├── app/          # Pages (blog, CMS dashboard, search, etc.)
│   ├── components/   # UI components (blog, cms, layout, seo)
│   └── lib/          # API clients, types, utilities
└── .github/workflows/ci.yml  # CI pipeline
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env       # Edit with your secrets
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the blog and [http://localhost:3000/cms](http://localhost:3000/cms) for the editorial CMS.

## Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | ✅ | Django secret key |
| `DEBUG` | ✅ | `True` for dev, `False` for prod |
| `DATABASE_URL` | Prod | PostgreSQL connection string |
| `CLOUDINARY_CLOUD_NAME` | Prod | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Prod | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Prod | Cloudinary API secret |
| `CORS_ALLOWED_ORIGINS` | ✅ | Comma-separated allowed origins |
| `SENTRY_DSN` | Optional | Sentry error tracking DSN |

### Frontend (`.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Site name |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics ID |

## Deployment

### Railway (Backend)

1. Connect the repo to Railway
2. Set **Root Directory** to `backend`
3. Add environment variables (see table above)
4. Add a PostgreSQL plugin — `DATABASE_URL` will be auto-injected
5. Deploy — Railway will use the `Dockerfile` automatically

### Cloudflare Workers (Frontend)

1. `cd frontend`
2. Run `npx wrangler login`
3. Set the required Worker secrets:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_GA_ID`
4. Validate with `npm run preview`
5. Deploy with `npm run deploy`

## License

Private — All rights reserved.
