# Frontend

Frontend em Next.js 16 preparado para deploy no Cloudflare Workers com OpenNext.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Preview no runtime do Cloudflare

Crie `.dev.vars` a partir de `.dev.vars.example` se quiser forcar `NEXTJS_ENV=development`.

```bash
npm run preview
```

Esse comando compila o app com OpenNext e sobe um preview via Wrangler, mais proximo do runtime real de producao do que `next dev`.

## Deploy com Cloudflare CLI

1. Autentique o Wrangler:

```bash
npx wrangler login
```

2. Defina as variaveis necessarias no projeto Cloudflare:

```bash
npx wrangler secret put NEXT_PUBLIC_API_URL
npx wrangler secret put NEXT_PUBLIC_SITE_URL
npx wrangler secret put NEXT_PUBLIC_SITE_NAME
npx wrangler secret put NEXT_PUBLIC_GA_ID
```

3. Gere os tipos opcionais do ambiente:

```bash
npm run cf-typegen
```

4. Faça o deploy:

```bash
npm run deploy
```

O worker usa a configuracao de `wrangler.jsonc` e publica o frontend em Cloudflare Workers.
