import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`rounded-lg border border-[var(--line)] bg-[var(--card)] shadow-[0_20px_60px_rgba(31,28,25,0.06)] ${className}`}
    >
      {children}
    </article>
  );
}
