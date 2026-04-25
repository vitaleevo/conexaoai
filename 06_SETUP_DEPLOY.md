# Conexao AI — Setup & Deploy Guide

## Pré-requisitos

- Python 3.12+
- Node.js 20+
- Git

---

## 1. Backend — Django

```bash
# Clonar e criar ambiente virtual
git clone https://github.com/seu-usuario/conexao-ai-backend.git
cd conexao-ai-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores

# Banco de dados e superusuário
python manage.py migrate
python manage.py createsuperuser

# Rodar servidor de desenvolvimento
python manage.py runserver
# Acesse: http://localhost:8000/admin
# API:    http://localhost:8000/api
```

---

## 2. Frontend — Next.js

```bash
git clone https://github.com/seu-usuario/conexao-ai-frontend.git
cd conexao-ai-frontend
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Rodar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## 3. Deploy — Backend no Railway

```bash
# 1. Crie conta em railway.app
# 2. Conecte seu repositório GitHub
# 3. Adicione as variáveis de ambiente no painel do Railway:

SECRET_KEY=sua-chave-secreta
DEBUG=False
ALLOWED_HOSTS=sua-api.railway.app
DATABASE_URL=postgresql://...    # Railway provisiona automaticamente
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ALLOWED_ORIGINS=https://conexao.ai

# 4. Railway detecta o Dockerfile e faz deploy automático
# 5. O startCommand no railway.toml roda as migrations automaticamente
```

---

## 4. Deploy — Frontend na Vercel

```bash
# 1. Crie conta em vercel.com
# 2. Importe o repositório do frontend
# 3. Adicione as variáveis de ambiente no painel da Vercel:

NEXT_PUBLIC_API_URL=https://sua-api.railway.app/api
NEXT_PUBLIC_SITE_URL=https://conexao.ai
NEXT_PUBLIC_SITE_NAME=Conexao AI

# 4. Vercel detecta Next.js e configura tudo automaticamente
# 5. Deploy disponível em: https://conexao.ai
```

---

## 5. Domínio Custom

```
# Vercel:
# Settings > Domains > Add "conexao.ai"
# Configure DNS: A record → 76.76.21.21

# Railway:
# Settings > Domains > Add "api.conexao.ai"
# Configure DNS: CNAME → sua-app.railway.app

# Resultado:
# https://conexao.ai          → Frontend (Vercel)
# https://api.conexao.ai/api  → Backend (Railway)
```

---

## 6. Primeiro Conteúdo

```bash
# 1. Acesse o admin Django
# http://localhost:8000/admin (ou sua URL de produção)

# 2. Crie categorias primeiro:
# Admin > Blog > Categories > Add Category
# Sugestão: "Ferramentas de IA", "Automação", "Ganhar Dinheiro", "Prompts"

# 3. Crie seu perfil de Author:
# Admin > Blog > Authors > Add Author

# 4. Publique seu primeiro post:
# Admin > Blog > Posts > Add Post
# Preencha: title, content, excerpt, category, tags, status=published

# 5. Verifique a API:
# http://localhost:8000/api/posts/
# http://localhost:8000/api/categories/
```

---

## 7. Configurar DJANGO_SETTINGS_MODULE

```bash
# Para usar o split de settings, configure no .env ou no Dockerfile:

# Desenvolvimento:
export DJANGO_SETTINGS_MODULE=config.settings.development

# Produção:
export DJANGO_SETTINGS_MODULE=config.settings.production
```

---

## Checklist de Go-Live

- [ ] `SECRET_KEY` forte e único em produção
- [ ] `DEBUG=False` em produção
- [ ] PostgreSQL configurado e migrations rodadas
- [ ] Cloudinary configurado para media em produção
- [ ] CORS configurado para aceitar apenas o domínio do frontend
- [ ] HTTPS ativo (Railway e Vercel fazem isso automaticamente)
- [ ] Domínio custom configurado
- [ ] Google Search Console verificado com sitemap submetido
- [ ] Google Analytics configurado
- [ ] Primeiro post publicado
- [ ] Newsletter CTA funcionando
- [ ] Teste de velocidade no PageSpeed Insights (meta: 90+ mobile)

---

## Comandos Úteis

```bash
# Backup do banco de dados
python manage.py dumpdata --natural-foreign --natural-primary > backup.json

# Restaurar backup
python manage.py loaddata backup.json

# Criar migration após alterar models
python manage.py makemigrations
python manage.py migrate

# Shell interativo com Django
python manage.py shell

# Criar superusuário adicional
python manage.py createsuperuser

# Build estático do Next.js
npm run build
npm run start

# Verificar bundle size
npm run build -- --analyze
```

---

## Endpoints da API — Referência

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/posts/` | Lista de posts publicados |
| GET | `/api/posts/?is_featured=true` | Posts em destaque |
| GET | `/api/posts/?category__slug=ia` | Posts por categoria |
| GET | `/api/posts/?search=chatgpt` | Busca em posts |
| GET | `/api/posts/slugs/` | Todos os slugs (para SSG) |
| GET | `/api/posts/{slug}/` | Post por slug |
| GET | `/api/posts/{slug}/related/` | Posts relacionados |
| GET | `/api/categories/` | Lista de categorias |
| GET | `/api/tags/` | Lista de tags |
| POST | `/api/newsletter/subscribe/` | Inscrever no newsletter |
| POST | `/api/auth/token/` | Obter JWT token |
| POST | `/api/auth/token/refresh/` | Renovar JWT token |
