import { Zap, Globe, Cpu } from "lucide-react";

export const primaryNav = [
  { href: "/search?q=ai", label: "AI" },
  { href: "/search?q=business", label: "Business" },
  { href: "/search?q=tools", label: "Tools" },
  { href: "/search?q=guides", label: "Guides" },
  { href: "/blog", label: "Analysis" },
];


export const editorialPillars = [
  {
    href: "/search?q=ai+agents",
    label: "AI Agents",
    description: "Architecture and deployment of autonomous agents with real business value.",
  },
  {
    href: "/search?q=saas",
    label: "SaaS Ops",
    description: "Systems for building, running and scaling lean software operations.",
  },
  {
    href: "/search?q=growth",
    label: "Growth",
    description: "Modern distribution, monetization and revenue systems for the AI era.",
  },
  {
    href: "/search?q=automation",
    label: "Automation",
    description: "Practical logic for replacing manual workflows and increasing team velocity.",
  },
  {
    href: "/search?q=guides",
    label: "Guides",
    description: "Dense technical walkthroughs and blueprints for global operators.",
  },
];

export const homepageSignals = [
  {
    title: "AI Implementation",
    description: "Real-world workflows, from complex prompts to automated production systems.",
    icon: Zap,
  },
  {
    title: "Business Leverage",
    description: "Monetization models and scale strategies for the modern internet economy.",
    icon: Globe,
  },
  {
    title: "Systems & Tools",
    description: "Stack decisions and automation playbooks that multiply team output.",
    icon: Cpu,
  },
];
