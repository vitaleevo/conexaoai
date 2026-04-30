# Estrutura do Frontend (Next.js)

O frontend utiliza o que há de mais moderno no ecossistema React para entregar uma experiência rápida e fluida.

## Stack Tecnológica
- **Next.js 16 (App Router)**: Roteamento baseado em arquivos e otimização automática.
- **React 19**: Uso de Server Components para reduzir o bundle de JS no cliente.
- **Tailwind CSS 4**: Estilização via classes utilitárias com performance otimizada.
- **Shadcn/ui**: Biblioteca de componentes acessíveis e customizáveis.

## Organização de Pastas
- `/app`: Rotas e páginas (Home, Blog, Busca, Login).
- `/components`: Componentes reutilizáveis (UI, Layout, Newsletter).
- `/lib`: Utilitários, configurações de API e constantes.
- `/public`: Ativos estáticos (Logos, Favicons).

## Estratégias de Dados
- **SSG (Static Site Generation)**: Para posts do blog que não mudam com frequência.
- **ISR (Incremental Static Regeneration)**: Para atualizar o conteúdo sem precisar de um novo deploy.
- **Client-side Fetching**: Para buscas dinâmicas e interações do usuário (como newsletter).

## Monitoramento
- **PostHog**: Rastreamento de eventos (cliques, visualizações de página).
- **Sentry**: Captura de erros no lado do cliente.
