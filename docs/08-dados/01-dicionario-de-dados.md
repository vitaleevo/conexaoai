# Dicionário de Dados e Analytics

Entender os dados é o que nos permite crescer de forma baseada em evidências.

## 1. Principais Entidades (Database)

### Post (Blog)
- `title`: Título otimizado para SEO.
- `slug`: URL amigável.
- `content`: Conteúdo em formato Rich Text/Markdown.
- `status`: [Draft, Published, Scheduled].
- `author`: Relacionamento com a tabela de usuários.

### Subscriber (Newsletter)
- `email`: Endereço único do assinante.
- `is_active`: Status da assinatura.
- `joined_at`: Data de entrada para análise de coorte.

## 2. Eventos de Analytics (PostHog)
Rastrearemos as seguintes ações para medir o engajamento:
- `pageview`: Visualização de página padrão.
- `newsletter_signup`: Sucesso no preenchimento do formulário de newsletter.
- `blog_post_read_75`: O usuário leu 75% do artigo (indicador de alta qualidade).
- `search_query`: O que os usuários estão procurando (identificação de gaps de conteúdo).

## 3. Cache e Performance
- **Redis Keys**: Estrutura de chaves para cache de posts (`post:slug`) e categorias (`cat:slug`).
- **TTL**: Tempo de vida do cache definido de acordo com a frequência de atualização.
