# Conexao AI — SEO, Content Strategy & Scaling

---

## SEO Checklist

### On-Page SEO
- [x] `generateMetadata()` dinâmico por página
- [x] Open Graph + Twitter Card tags
- [x] JSON-LD Article structured data
- [x] Canonical URL em todo post (sem conteúdo duplicado)
- [x] Image `alt` text em todas as imagens
- [x] `reading_time` calculado automaticamente pelo backend
- [x] Breadcrumb schema em páginas de categoria
- [x] FAQ schema para posts de review de ferramentas

### Technical SEO
- [x] `sitemap.xml` dinâmico via `app/sitemap.ts`
- [x] `robots.txt` via `app/robots.ts`
- [x] `next/image` — auto WebP/AVIF, lazy load, tamanhos responsivos
- [x] SSG para posts (melhor TTFB)
- [x] ISR para home/listing (conteúdo sempre fresco)
- [x] Core Web Vitals otimizados
- [x] `next/font` — carregamento de fontes sem layout shift
- [x] Headers de segurança (X-Frame-Options, CSP, etc.)

---

## Slug Optimization Strategy

### Regras para Slugs Perfeitos para SEO

| Regra | Bom | Ruim |
|---|---|---|
| Palavra-chave primeiro | `melhores-ferramentas-ia-2025` | `2025-ferramentas-ia-melhores` |
| Máximo 5-6 palavras | `automatizar-instagram-ia` | `como-automatizar-o-instagram-com-inteligencia-artificial` |
| Sem stop words | `ganhar-dinheiro-afiliados` | `como-ganhar-dinheiro-com-afiliados` |
| Tudo em minúsculas | `chatgpt-copywriting` | `ChatGPT-Copywriting` |
| Sem caracteres especiais | `ia-para-videos` | `ia_para_vídeos` |

### Regras Absolutas
- **Nunca mude um slug após publicação** — use redirect 301 se inevitável
- Canonical sempre definido para prevenir penalidades por conteúdo duplicado
- Evite parâmetros de URL em páginas indexáveis

---

## Content Strategy — Estrutura de Artigos para SEO

### Template de Post Ideal

```
H1 — Palavra-chave primária, 50-60 chars
     ex: "Melhores Ferramentas de IA para Copywriting em 2025"

INTRO (150 palavras)
- Hook que captura atenção
- Palavra-chave primária nas primeiras 100 palavras
- Preview do valor que o artigo entrega

H2 — Palavra-chave LSI / pergunta secundária
     ex: "O que é IA para copywriting?"

H2 — Seção de lista/comparação (mira Featured Snippets)
     ex: "Top 7 Ferramentas de IA para Copywriting"

     [Conteúdo principal — 1.000-2.500 palavras]

H2 — Links internos contextuais
     3-5 links para outros posts do Conexao AI

H2 — CTA de afiliado (contextual, pós-valor)
     Nunca antes de entregar valor

H2 — FAQ (People Also Ask)
     4-6 perguntas com respostas diretas

FINAL — CTA de Newsletter
```

---

## Internal Linking Strategy — Arquitetura de 3 Camadas

### Camada 1 — Pillar Pages (Guias Definitivos)
- Conteúdo longo (3.000+ palavras)
- Ex: "Guia Definitivo de Ferramentas de IA", "Como Ganhar Dinheiro Online com Automação"
- Recebe o maior número de links internos
- Atualizado trimestralmente

### Camada 2 — Cluster Posts (Reviews e Tutoriais)
- Conteúdo específico (1.200-2.000 palavras)
- Ex: "Review do ChatGPT Plus", "Como usar Zapier com IA"
- Linka para o Pillar da categoria
- Linka para outros Cluster Posts relacionados

### Camada 3 — News / Quick Tips
- Conteúdo curto e atemporal (500-800 palavras)
- Sempre linka para pelo menos 1 Pillar Page
- Ideal para capturar tráfego de cauda longa

### Regras de Linkagem
- Todo post deve ter ao menos **3 links internos saindo**
- Todo Pillar Page deve ter ao menos **10 links recebidos**
- Use anchor text descritivo (não "clique aqui")
- Evite mais de 1 link para o mesmo destino no mesmo post

---

## Categories — Priority Topics

| Categoria | Tipo de Conteúdo | Potencial de Monetização |
|---|---|---|
| Ferramentas de IA | Listas, comparações, reviews | Afiliados (alto ticket) |
| Automação | Tutoriais com código/screenshots | Afiliados + Newsletter |
| Ganhar Dinheiro | Estudos de caso, métodos | Afiliados + SaaS futuro |
| Prompts de IA | Bibliotecas, templates | Lead gen → newsletter |
| Sistemas Digitais | Guias de fluxo de trabalho | SaaS futuro |

---

## Recommendation System — Related Posts

### Fase 1 (Implementado — sem dependências extras)

Algoritmo de pontuação por sobreposição de tags na `RelatedPostsView`:

```python
# Pontuação = número de tags compartilhadas
# Desempate = data de publicação mais recente
# Sempre exclui o post atual
# Retorna máximo de 4 posts
```

### Fase 2 (Próximos 6 meses)

Similaridade por vetores TF-IDF:

```python
# Armazenar vetor TF-IDF de cada post em campo JSON
# Calcular similaridade coseno no momento da query
# Ou pré-computar nightly via management command
```

### Fase 3 (Escala — 50k+ visitantes/mês)

Sinais comportamentais (filtragem colaborativa leve):

```python
# Rastrear quais posts "relacionados" os usuários realmente clicam
# Armazenar CTR por par de posts
# Boostar pares com alto CTR histórico
```

---

## Monetization Integration Points

### Anúncios
- Google AdSense: evite interromper a leitura — posicione após o 3º parágrafo e no final
- Mediavine/Raptive ao escalar para 50k+ sessões/mês (RPM muito maior)

### Afiliados
- Sempre divulgue parcerias (exigência legal + confiança)
- Tabelas de comparação convertem melhor que parágrafos
- CTAs contextuais superam banners genéricos
- Rastreie cliques por post para identificar top performers

### Newsletter
- CTA no final de todo post (obrigatório)
- Lead magnets específicos por categoria (ex: "50 Prompts de IA" para categoria Prompts)
- Sequência de boas-vindas de 5 emails (nurture → pitch → produto)

### Futuro SaaS
- Produza conteúdo "problem-aware" que o SaaS resolverá
- Use o blog para validar demanda antes de construir

---

## Scaling Roadmap

### Fase 1 — Launch (0–10k visitantes/mês)
- Arquitetura atual: Django + SQLite → PostgreSQL, Next.js no Vercel
- Django Admin como CMS (sem ferramenta externa)
- SSG para todos os posts, ISR para home/listing
- Cloudinary para mídia (free tier = 25GB)
- 1 instância Railway/Render + Vercel hobby

**Custo estimado: ~$0–15/mês**

### Fase 2 — Growth (10k–100k visitantes/mês)
- Redis cache para respostas de API
- Celery + Redis para jobs de newsletter
- PostgreSQL dedicado no Neon.tech ou Railway
- Sentry + Posthog para monitoramento
- Algolia para busca avançada
- CDN para imagens de media

**Custo estimado: ~$50–150/mês**

### Fase 3 — Scale (100k+ visitantes/mês)
- Apps Django separados em microsserviços
- Read replicas para PostgreSQL
- Elasticsearch para busca full-text
- Cloudflare Workers para cache de API na edge
- A/B testing de CTAs
- Lançamento de produto SaaS
- Funções de edge para personalização

**Custo estimado: ~$300–800/mês (coberto por receita)**

---

## Database Migration Path

```python
# Development (agora) — SQLite, zero configuração
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Produção (mesmos models, zero alteração de código)
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ['DATABASE_URL'],
        conn_max_age=600
    )
}

# Migrar dados do SQLite para PostgreSQL:
# python manage.py dumpdata --natural-foreign --natural-primary > backup.json
# (configure PostgreSQL)
# python manage.py migrate
# python manage.py loaddata backup.json
```

---

## JWT Auth — Setup Completo (Future Ready)

```python
# settings/base.py — já configurado
INSTALLED_APPS += ['rest_framework_simplejwt']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

```python
# apps/accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
```

---

## Performance Targets (Core Web Vitals)

| Métrica | Target | Como Atingir |
|---|---|---|
| LCP | < 2.5s | SSG + CDN + next/image com `priority` na imagem hero |
| FID / INP | < 100ms | Mínimo de JS no cliente, RSC por padrão |
| CLS | < 0.1 | Dimensões explícitas em todas as imagens |
| TTFB | < 200ms | SSG (arquivo estático servido da edge) |
| FCP | < 1.8s | Fontes com `next/font`, sem render-blocking CSS |
