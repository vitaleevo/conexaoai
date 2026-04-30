import os
import django
import sys
from django.utils import timezone
from django.utils.text import slugify

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.blog.models import Post, Category, Tag, Author
from django.contrib.auth import get_user_model

User = get_user_model()

def populate():
    # 1. Get or create Author
    user = User.objects.filter(username='Vitaleevo').first()
    if not user:
        print("User Vitaleevo not found. Please create it first.")
        return

    author, _ = Author.objects.get_or_create(
        user=user,
        defaults={
            'role': 'admin',
            'bio': 'Especialista em Inteligência Artificial e Sistemas Digitais de alta performance.',
            'credentials': 'Founder @ Conexão AI'
        }
    )

    # 2. Categories
    cat_ia, _ = Category.objects.get_or_create(name='Inteligência Artificial', defaults={'description': 'Tudo sobre modelos, agentes e o futuro da IA.'})
    cat_automation, _ = Category.objects.get_or_create(name='Automação', defaults={'description': 'Fluxos de trabalho inteligentes e eficiência operacional.'})
    cat_business, _ = Category.objects.get_or_create(name='Negócios Digitais', defaults={'description': 'Estratégias para monetização e escala online.'})

    # 3. Tags
    tag_agent, _ = Tag.objects.get_or_create(name='Agentes de IA')
    tag_saas, _ = Tag.objects.get_or_create(name='SaaS')
    tag_future, _ = Tag.objects.get_or_create(name='Futuro')
    tag_prod, _ = Tag.objects.get_or_create(name='Produtividade')

    # 4. Posts
    posts_data = [
        {
            'title': 'O Futuro da Automação com Agentes de IA em 2026',
            'excerpt': 'Descubra como os agentes autônomos estão transformando a produtividade corporativa e o que esperar para os próximos meses.',
            'content': """# O Futuro da Automação com Agentes de IA

A Inteligência Artificial deixou de ser apenas um chatbot para se tornar uma força operacional ativa. Em 2026, estamos vendo a ascensão dos **Agentes Autônomos de IA** — sistemas capazes de planejar, executar e corrigir tarefas sem intervenção humana constante.

## Por que agora?
O amadurecimento dos modelos de linguagem (LLMs) e a integração com ferramentas externas (Tool Use) permitiram que a IA não apenas "falasse", mas "fizesse".

### Principais Impactos:
1. **Produtividade em Larga Escala**: Tarefas que levavam horas agora são resolvidas em segundos por agentes especializados.
2. **Redução de Erros**: Diferente de scripts estáticos, agentes de IA podem raciocinar sobre falhas e tentar rotas alternativas.
3. **Escalabilidade**: Uma empresa pode "contratar" centenas de agentes para lidar com picos de demanda.

Este é apenas o começo. Na Conexão AI, acreditamos que cada profissional terá uma frota de agentes ao seu dispor até o final desta década.
""",
            'category': cat_ia,
            'tags': [tag_agent, tag_future],
            'is_featured': True
        },
        {
            'title': 'Como Monetizar Micro-SaaS na Era da IA',
            'excerpt': 'Estratégias práticas para transformar APIs de IA em produtos lucrativos com baixo custo de manutenção.',
            'content': """# Como Monetizar Micro-SaaS na Era da IA

A barreira de entrada para criar software nunca foi tão baixa. Com ferramentas de geração de código e APIs poderosas, o modelo de **Micro-SaaS** (Software as a Service focado em um nicho específico) tornou-se a rota mais rápida para o lucro digital.

## O Modelo de "Wrapper" de IA
Muitos criticam os "AI Wrappers", mas a verdade é que o valor não está no modelo base, mas na **interface e na solução do problema do usuário**.

### 3 Passos para o Sucesso:
1. **Identifique um Problema Específico**: Não tente criar o "novo ChatGPT". Crie a "ferramenta de IA para advogados imobiliários em Angola".
2. **Foque na UX**: O usuário paga pela facilidade de uso, não pela tecnologia por trás.
3. **Distribuição é Tudo**: Em um mercado saturado, quem tem a melhor estratégia de SEO e tráfego orgânico vence.

Na era da IA, a agilidade de execução supera a complexidade técnica.
""",
            'category': cat_business,
            'tags': [tag_saas, tag_future],
            'is_featured': False
        },
        {
            'title': 'Top 5 Ferramentas de Automação para Equipes Modernas',
            'excerpt': 'Analisamos as melhores ferramentas de 2026 que realmente entregam o que prometem em termos de eficiência.',
            'content': """# Top 5 Ferramentas de Automação

Eficiência operacional é o diferencial competitivo número um em 2026. Aqui estão as ferramentas que nossa equipe testou e recomenda:

1. **Make (Antigo Integromat)**: Continua sendo a rainha da orquestração visual de APIs.
2. **N8N**: A alternativa open-source perfeita para quem precisa de controle total e privacidade.
3. **Claude Code**: A revolução na codificação assistida por IA que está mudando como desenvolvedores trabalham.
4. **LangChain**: O framework essencial para quem está construindo aplicações complexas de agentes de IA.
5. **Zapier Central**: A nova aposta do Zapier em agentes que aprendem com seus dados.

## Qual escolher?
A escolha depende da sua necessidade de customização versus facilidade de uso. Se você quer algo rápido, vá de Make ou Zapier. Se quer escala e controle, N8N é a resposta.
""",
            'category': cat_automation,
            'tags': [tag_prod],
            'is_featured': False
        }
    ]

    for data in posts_data:
        tags = data.pop('tags')
        post, created = Post.objects.get_or_create(
            title=data['title'],
            defaults={
                'excerpt': data['excerpt'],
                'content': data['content'],
                'author': author,
                'category': data['category'],
                'status': 'published',
                'published_at': timezone.now(),
                'is_featured': data['is_featured']
            }
        )
        if created:
            post.tags.set(tags)
            print(f"Created post: {post.title}")
        else:
            print(f"Post already exists: {post.title}")

if __name__ == '__main__':
    populate()
