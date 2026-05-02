# Plano Para Finalizar o Sistema

Estado atual: frontend Next.js com backend Supabase. Não existe API própria exposta pelo Next.js; a superfície pública é Supabase Auth, PostgREST e Storage com RLS.

## 1. Autenticação e CMS

Status: parcial

- Implementado: primeiro utilizador editorial criado no Supabase Auth.
- Implementado: login Supabase validado por smoke test.
- Implementado: acesso protegido de `/cms/*` redireciona anônimos para `/cms/login`.
- Implementado: logout Supabase mantido no header do CMS.
- Implementado: policies de CMS agora usam roles reais (`admin`, `manager`, `editor`, `author`, `viewer`).
- Implementado: `authors.user_id` amarrado ao utilizador Supabase Auth.

## 2. Dados editoriais

Status: parcial

- Implementado: conteúdo inicial real com posts publicados, um draft, categorias e tags.
- Implementado: anônimos veem só posts publicados; drafts ficam bloqueados por RLS.
- Implementado: criação, edição e remoção de posts validadas com utilizador CMS autenticado.
- Implementado: contadores `post_count` de categorias e tags são recalculados por trigger.
- Implementado: triggers para `updated_at`.

## 3. Media e uploads

Status: parcial

- Implementado: upload autenticado no bucket `media` validado.
- Implementado: URLs públicas de imagens preservadas sem policy ampla de listagem.
- Implementado: remoção de asset e objeto do Storage validada.
- Implementado: bucket limitado a imagens e 5 MB; CMS também valida tipo e tamanho.

## 4. Segurança

Status: parcial

- Manter Security Advisor do Supabase sem avisos.
- Implementado: Security Advisor do Supabase sem avisos após hardening.
- Implementado: policies de insert público para newsletter e tracking estão limitadas por validações.
- Adicionar rate limit externo para newsletter e click tracking se forem usados publicamente.
- Confirmar que variáveis sensíveis não entram no Git.
- Rotacionar credenciais se alguma password tiver sido partilhada fora do ambiente seguro.

## 5. Produção

Status: faltando

- Definir destino final: Cloudflare Workers/OpenNext ou outro host.
- Configurar variáveis de produção:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SITE_NAME`
- Validar `npm run build`.
- Validar `npx opennextjs-cloudflare build` em ambiente Linux/WSL, porque Windows ainda é instável para OpenNext.
- Executar deploy e testar URL pública.

## 6. Qualidade

Status: parcial

- Manter `npm run lint` verde.
- Manter `npm run build` verde.
- Implementado: `npm run test:security` valida leitura pública só de posts publicados e bloqueio de insert anônimo.
- Implementado: `npm run test:cms-routes` valida redirecionamento de `/cms/*` sem sessão.
- Implementado: `npm run test:cms-auth` valida login Supabase e operações CMS autenticadas.

## Próximo Passo Imediato

Criar o primeiro utilizador editorial no Supabase Auth e associá-lo a `public.authors.user_id`. Depois disso, testar o fluxo real do CMS autenticado.
