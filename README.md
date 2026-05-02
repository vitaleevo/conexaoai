# ConexãoAI

Aplicação frontend Next.js com backend totalmente baseado em Supabase.

## Estrutura

- `frontend/`: aplicação Next.js.
- `supabase/`: schema, migrations e seed do Supabase.

## Variáveis do frontend

Crie `frontend/.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hsdfhddlflattjbozudo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ConexãoAI
```

## Superfície de API

Este projeto não expõe API própria no Next.js: não há `app/api` nem route handlers `route.ts`.

A camada de dados exposta é o Supabase:

- Auth para login do CMS.
- PostgREST para tabelas públicas e autenticadas.
- Storage para media.
- RLS habilitado em todas as tabelas editoriais.

As operações administrativas do CMS dependem de sessão autenticada do Supabase. As leituras públicas ficam limitadas pelas policies.

## Rodar local

```bash
cd frontend
npm install
npm run dev
```

## Supabase

Use as migrations em `supabase/migrations`. O bucket público `media` é criado pela migration inicial.

Projeto Supabase atual: `conexaoai` (`hsdfhddlflattjbozudo`).

Migrations remotas aplicadas:

- `initial_content_platform`
- `tighten_public_rls_policies`
