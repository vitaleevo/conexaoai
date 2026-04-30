# Infraestrutura e Operações (DevOps)

A infraestrutura foi desenhada para ser resiliente, escalável e de baixo custo de manutenção.

## Plataformas de Hospedagem
- **Vercel**: Hospeda o Frontend (Next.js). Oferece CDN global e Edge Functions.
- **Railway**: Hospeda o Backend (Django), Banco de Dados (PostgreSQL) e Cache (Redis).

## Pipeline de CI/CD
1. **GitHub**: Repositório central de código.
2. **Auto-Deploy**: O push na branch `main` dispara automaticamente builds na Vercel e no Railway.
3. **Verificações**: Testes automatizados rodam antes do deploy final.

## Segurança e Resiliência
- **Variáveis de Ambiente**: Todas as chaves sensíveis são gerenciadas via painéis das plataformas (Vercel/Railway).
- **SSL/HTTPS**: Configurado automaticamente em todos os endpoints.
- **Backups**: (Em implementação) Rotinas de backup diário para o PostgreSQL no Railway.

## Plano de Monitoramento (Tiers)
- **Tier 1 (Atual)**: Sentry e PostHog ativos.
- **Tier 2 (Planejado)**: Uptime Kuma e Cloudflare para proteção DDoS extra.
