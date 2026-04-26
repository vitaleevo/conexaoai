import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";
import { Separator } from "@/components/ui/separator";
import { Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";

const socialLinks = [
  { href: "https://x.com/holyconexao", icon: Twitter, label: "X (Twitter)" },
  { href: "https://linkedin.com/in/holyconexao", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com/holyconexao", icon: Github, label: "GitHub" },
];

const secondaryLinks = [
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
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
              Connecting ideas, building the future with practical analysis on AI, business, tools 
              and systems designed for operators. The definitive source for operational excellence.
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
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Topics</h4>
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
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h4>
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
            © {new Date().getFullYear()} Conexao AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="size-3" />
              <span>English (US)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3" />
              <span>contact@conexao.ai</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
