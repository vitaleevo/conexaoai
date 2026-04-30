# Visão Geral da Arquitetura

O sistema segue o padrão **Headless CMS**, onde o Backend funciona puramente como um fornecedor de dados via API (JSON) e o Frontend é uma aplicação independente que consome esses dados.

## Componentes do Sistema

### 1. Backend (Django)
- Atua como o núcleo de dados e lógica de negócio.
- Gerencia o Banco de Dados (PostgreSQL).
- Fornece a API REST para o Frontend.
- Gerencia o cache (Redis) para garantir respostas rápidas.

### 2. Frontend (Next.js)
- Responsável por toda a interface do usuário.
- Utiliza **Server-Side Rendering (SSR)** e **Static Site Generation (SSG)** para máxima performance e SEO.
- Componentes modulares construídos com Tailwind CSS 4 e Shadcn/ui.

### 3. Serviços Externos
- **Cloudinary**: Hospedagem e otimização de imagens.
- **Sentry**: Monitoramento de erros e performance em tempo real.
- **PostHog**: Analytics comportamental dos usuários.

## Diagrama de Fluxo (Simplificado)
`Usuário` -> `Next.js (Vercel)` -> `Django API (Railway)` -> `PostgreSQL / Redis`
