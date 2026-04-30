import { Zap, Globe, Cpu } from "lucide-react";

export const primaryNav = [
  { href: "/search?q=ia", label: "IA" },
  { href: "/search?q=negocios", label: "Negócios" },
  { href: "/search?q=ferramentas", label: "Ferramentas" },
  { href: "/search?q=guias", label: "Guias" },
  { href: "/blog", label: "Análises" },
];


export const editorialPillars = [
  {
    href: "/search?q=agentes+ia",
    label: "Agentes de IA",
    description: "Arquitetura e deploy de agentes autônomos com valor real de negócio.",
  },
  {
    href: "/search?q=saas",
    label: "SaaS Ops",
    description: "Sistemas para construir, rodar e escalar operações de software enxutas.",
  },
  {
    href: "/search?q=crescimento",
    label: "Crescimento",
    description: "Distribuição moderna, monetização e sistemas de receita para a era da IA.",
  },
  {
    href: "/search?q=automacao",
    label: "Automação",
    description: "Lógica prática para substituir fluxos manuais e aumentar a velocidade da equipe.",
  },
  {
    href: "/search?q=guias",
    label: "Guias",
    description: "Walkthroughs técnicos densos e blueprints para operadores globais.",
  },
];

export const homepageSignals = [
  {
    title: "Implementação de IA",
    description: "Fluxos de trabalho do mundo real, de prompts complexos a sistemas de produção automatizados.",
    icon: Zap,
  },
  {
    title: "Alavancagem de Negócios",
    description: "Modelos de monetização e estratégias de escala para a economia moderna da internet.",
    icon: Globe,
  },
  {
    title: "Sistemas & Ferramentas",
    description: "Decisões de stack e playbooks de automação que multiplicam a entrega da sua equipe.",
    icon: Cpu,
  },
];

