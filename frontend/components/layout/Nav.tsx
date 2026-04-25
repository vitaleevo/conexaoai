import Link from "next/link";

import { primaryNav } from "@/lib/site";

export function Nav() {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-1">
      {primaryNav.map((item) => (
        <Link key={item.href} className="transition hover:text-[var(--foreground)]" href={item.href}>
          <span className="inline-flex whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--line)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
