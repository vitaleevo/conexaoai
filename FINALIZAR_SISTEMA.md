# Plano Para Finalizar o Sistema

Estado atual: frontend Next.js com backend Supabase. Não existe API própria exposta pelo Next.js; a superfície pública é Supabase Auth, PostgREST e Storage com RLS.

## 1. Autenticação e CMS

Status: parcial

- Pendente: criar o primeiro utilizador editorial no Supabase Auth.
- Confirmar login em `/cms/login`.
- Validar acesso protegido em `/cms`, `/cms/posts`, `/cms/media`, `/cms/newsletter`.
- Confirmar logout e redirecionamento para login.
- Implementado: policies de CMS agora usam roles reais (`admin`, `manager`, `editor`, `author`, `viewer`).
- Pendente: amarrar `authors.user_id` ao utilizador Supabase Auth.

## 2. Dados editoriais

Status: parcial

- Implementado: conteúdo inicial real com posts publicados, um draft, categorias e tags.
- Implementado: anônimos veem só posts publicados; drafts ficam bloqueados por RLS.
- Validar criação, edição e remoção de posts pelo CMS.
- Implementado: contadores `post_count` de categorias e tags são recalculados por trigger.
- Implementado: triggers para `updated_at`.

## 3. Media e uploads

Status: parcial

- Testar upload autenticado no bucket `media`.
- Confirmar URLs públicas de imagens sem permitir listagem ampla do bucket.
- Validar remoção de assets do Storage ao apagar media no CMS.
- Definir limites de tamanho e tipos aceites para imagens.

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
- Pendente: teste automatizado de redirecionamento de `/cms/*` sem sessão.
- Pendente: teste automatizado de login com Supabase.

## Próximo Passo Imediato

Criar o primeiro utilizador editorial no Supabase Auth e associá-lo a `public.authors.user_id`. Depois disso, testar o fluxo real do CMS autenticado.
