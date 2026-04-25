import Link from "next/link";

import { primaryNav } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-3">
          <BrandLogo className="h-10 w-auto sm:h-12" variant="full" />
          <p className="text-sm leading-7 text-[var(--muted)]">
            Connecting ideas, building the future with practical analysis on AI, business, tools
            and systems designed for operators.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            {primaryNav.map((item) => (
              <Link key={item.href} className="transition hover:text-[var(--foreground)]" href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="transition hover:text-[var(--foreground)]" href="/newsletter">
              Newsletter
            </Link>
          </div>
          <p className="text-sm text-[var(--muted)]">© 2026 Conexao AI</p>
        </div>
      </div>
    </footer>
  );
}
