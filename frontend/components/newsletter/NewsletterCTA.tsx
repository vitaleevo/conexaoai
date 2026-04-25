import Link from "next/link";

export function NewsletterCTA() {
  return (
    <section className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            Newsletter
          </p>
          <h2 className="font-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
            Get the next clear breakdown before everyone else.
          </h2>
          <p className="text-base leading-8 text-[var(--muted)]">
            Weekly insights on AI, business systems, tools and internet operations with zero visual
            noise and no filler.
          </p>
        </div>
        <Link
          className="inline-flex rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          href="/newsletter"
        >
          Join newsletter
        </Link>
      </div>
    </section>
  );
}
