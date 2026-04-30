# Estrutura do Backend (Django)

O backend é construído com **Django 5.2** e organizado em aplicações modulares para facilitar a manutenção.

## Aplicações (Apps)

### 1. `accounts`
- **Responsabilidade**: Gestão de usuários, perfis e autenticação.
- **Segurança**: Hashing de senhas via Argon2.
- **RBAC**: Sistema de permissões baseado em níveis (Admin, Editor, Autor).

### 2. `blog`
- **Responsabilidade**: Núcleo de conteúdo.
- **Modelos**: `Post`, `Category`, `Tag`.
- **Performance**: Invalidação de cache automática via signals quando um post é atualizado.

### 3. `cms`
- **Responsabilidade**: Interface de administração customizada para o blog.
- **Segurança**: Protegido por permissões de nível de staff.

### 4. `newsletter`
- **Responsabilidade**: Gestão de assinantes e disparos de e-mail.
- **Transacional**: Integrado para evitar SPAM e gerenciar bounces.

## Tecnologias de Suporte
- **Django REST Framework (DRF)**: Criação das APIs consumidas pelo Next.js.
- **Redis**: Sistema de cache para diminuir a carga no banco de dados.
- **PostgreSQL**: Banco de dados relacional principal.
