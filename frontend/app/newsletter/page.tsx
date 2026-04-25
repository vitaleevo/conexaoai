import { NewsletterForm } from "./NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">Newsletter</p>
        <h1 className="font-display text-5xl leading-[0.98]">A weekly briefing for sharper AI decisions.</h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Short analysis, relevant reads and practical translation of what actually matters in AI,
          product, tools and automation.
        </p>
      </section>
      <NewsletterForm />
    </div>
  );
}
