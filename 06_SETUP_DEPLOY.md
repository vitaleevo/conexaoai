# Conexao AI — Guia de Deploy (Vercel & Railway)

Este guia descreve como colocar o projeto Conexão AI online usando **Vercel** para o frontend e **Railway** para o backend.

---

## 1. Preparação do GitHub

1. Certifique-se de que todas as alterações foram commitadas:
   ```bash
   git add .
   git commit -m "chore: preparar para deploy (Vercel & Railway)"
   git push origin main
   ```
2. O repositório deve estar público ou privado, mas acessível pelas plataformas.

---

## 2. Backend — Railway

O Railway hospedará o Django e o banco de dados PostgreSQL.

1. **Criar Novo Projeto**: No Railway, clique em "New Project" > "Deploy from GitHub repo".
2. **Selecionar Repositório**: Escolha `holyconexao/conexaoai`.
3. **Configurar Root Directory**:
   - Vá em **Settings** > **General**.
   - Defina **Root Directory** como `backend`.
4. **Adicionar PostgreSQL**: No projeto, clique em "New" > "Database" > "Add PostgreSQL".
5. **Variáveis de Ambiente (Variables)**:
   Adicione as seguintes chaves no painel do Railway:
   | Variável | Valor Sugerido |
   |---|---|
   | `DJANGO_SETTINGS_MODULE` | `config.settings.production` |
   | `SECRET_KEY` | (Gere uma chave segura) |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `*` (ou o domínio que o Railway gerar) |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Automático) |
   | `CORS_ALLOWED_ORIGINS` | `https://conexaoai.vercel.app` (URL do seu frontend) |
   | `CSRF_TRUSTED_ORIGINS` | `https://conexaoai.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | (Sua conta Cloudinary) |
   | `CLOUDINARY_API_KEY` | (Sua conta Cloudinary) |
   | `CLOUDINARY_API_SECRET` | (Sua conta Cloudinary) |

6. **Deploy**: O Railway detectará o `backend/railway.toml` e o `backend/Dockerfile` e iniciará o build.

---

## 3. Frontend — Vercel

A Vercel hospedará o Next.js.

1. **Importar Projeto**: No dashboard da Vercel, clique em "Add New" > "Project".
2. **Selecionar Repositório**: Escolha `holyconexao/conexaoai`.
3. **Configurar Root Directory**:
   - No campo **Root Directory**, selecione `frontend`.
4. **Variáveis de Ambiente**:
   Adicione estas variáveis no painel da Vercel:
   | Variável | Valor |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://sua-api.railway.app/api` |
   | `NEXT_PUBLIC_SITE_URL` | `https://conexao.ai` |
   | `NEXT_PUBLIC_SITE_NAME` | `Conexão AI` |

5. **Deploy**: Clique em "Deploy".

---

## 4. Checklist Pós-Deploy

- [ ] **Migrations**: Verifique se as tabelas foram criadas no Postgres (o comando de migrate está no Dockerfile).
- [ ] **Superuser**: No Railway, você pode abrir o terminal da máquina e rodar:
  ```bash
  python manage.py createsuperuser
  ```
- [ ] **Domínios**: Se tiver domínios próprios (ex: `conexao.ai`), configure o DNS na Vercel e o CNAME da API no Railway.
- [ ] **HTTPS**: Ambas as plataformas fornecem SSL automático.

---

## Endpoints Úteis

- **Admin**: `https://sua-api.railway.app/admin/`
- **API Docs**: `https://sua-api.railway.app/api/`
- **Site**: `https://conexao.ai` (ou sua URL da Vercel)
