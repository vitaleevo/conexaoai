export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">About</p>
        <h1 className="font-display text-5xl leading-[0.98]">Conexao AI publishes operational clarity.</h1>
        <p className="text-lg leading-8 text-[var(--muted)]">
          The blog is designed for readers who need clear explanations, strong hierarchy and dense
          value without the visual heaviness common in content sites.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-semibold">Editorial focus</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            AI applied to business: automation, agents, stack decisions, process design and
            operating leverage.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-semibold">Ideal reader</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Founders, operators, product leaders and lean teams that need reliable technical
            judgment before they commit time or budget.
          </p>
        </div>
      </section>
    </div>
  );
}
