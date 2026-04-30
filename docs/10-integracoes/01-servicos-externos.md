# Integrações de Terceiros

O Conexão AI é um ecossistema conectado. Aqui detalhamos como interagimos com serviços externos.

## 1. Cloudinary (Imagens)
- **Propósito**: Hospedagem e entrega de mídia.
- **Workflow**: O Django faz o upload; o Cloudinary aplica redimensionamento automático (f_auto, q_auto) para servir a imagem mais leve possível dependendo do dispositivo do usuário.

## 2. Sentry (Observabilidade)
- **Propósito**: Monitoramento de erros em tempo real.
- **Configuração**: Tags de `environment` (dev, prod) para separar erros de desenvolvimento de erros reais dos usuários.

## 3. PostHog (Product Analytics)
- **Propósito**: Entender o comportamento do usuário.
- **Integração**: Script no cabeçalho do Next.js configurado para não rastrear IPs sensíveis, mantendo a privacidade.

## 4. Railway & Vercel (Infrastructure as Code)
- **Railway API**: Usada para gerenciar variáveis de ambiente e deploys do backend.
- **Vercel CLI**: Integrada ao GitHub para deploys instantâneos do frontend.
