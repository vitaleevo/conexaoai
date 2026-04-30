import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";
import { Separator } from "@/components/ui/separator";
import { X, Mail, Globe } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

const socialLinks = [
  { href: "https://x.com/holyconexao", icon: X, label: "X (Twitter)" },
  { href: "https://linkedin.com/in/holyconexao", icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://github.com/holyconexao", icon: GitHubIcon, label: "GitHub" },
];

const secondaryLinks = [
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "Sobre" },
  { href: "/privacy", label: "Privacidade" },
  { href: "/terms", label: "Termos" },
];


export function Footer() {
  return (
    <footer className="bg-card">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <BrandLogo />
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Conectando ideias, construindo o futuro com análises práticas sobre IA, negócios, ferramentas 
              e sistemas desenhados para operadores. A fonte definitiva para excelência operacional.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Topics Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Tópicos</h4>

            <ul className="space-y-4">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Empresa</h4>

            <ul className="space-y-4">
              {secondaryLinks.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Conexão AI. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="size-3" />
              <span>Português (Brasil)</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3" />
              <span>contato@conexao.ai</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
