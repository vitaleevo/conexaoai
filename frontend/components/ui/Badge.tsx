export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
      {children}
    </span>
  );
}
