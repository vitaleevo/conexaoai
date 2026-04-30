# Segurança e Compliance

A confiança do usuário é o nosso ativo mais valioso.

## 1. Proteção do Servidor (Django Hardening)
- **Hashing**: Uso de `Argon2` para todas as senhas (mais seguro que o padrão PBKDF2).
- **Middlewares**: `SecurityMiddleware` configurado para forçar SSL, XSS Filter e HSTS.
- **CSRF**: Proteção ativa em todos os formulários e chamadas de API.

## 2. Privacidade de Dados (LGPD)
- **Consentimento**: O formulário de newsletter inclui um aviso claro sobre o uso do e-mail.
- **Direito ao Esquecimento**: Link de descadastro (unsubscribe) funcional em todos os e-mails enviados.
- **Minimalismo de Dados**: Coletamos apenas o estritamente necessário para a operação.

## 3. Segurança do Frontend
- **Content Security Policy (CSP)**: Restrição de domínios que podem executar scripts no nosso site.
- **Sanitização**: Todo conteúdo dinâmico (Markdown) é sanitizado antes de ser renderizado no React para evitar ataques de Injeção.

## 4. Auditoria
- Logs de acesso administrativo são armazenados para auditoria futura em caso de incidentes.
