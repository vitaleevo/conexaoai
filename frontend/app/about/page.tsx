import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-primary">About</p>
        <h1 className="font-display text-5xl leading-[0.98] transition-colors duration-500 ease-in-out hover:text-primary cursor-default">Conexao AI publishes operational clarity.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          The blog is designed for readers who need clear explanations, strong hierarchy and dense
          value without the visual heaviness common in content sites.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold transition-colors duration-500 ease-in-out hover:text-primary cursor-default">Editorial focus</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            AI applied to business: automation, agents, stack decisions, process design and
            operating leverage.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold transition-colors duration-500 ease-in-out hover:text-primary cursor-default">Ideal reader</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Founders, operators, product leaders and lean teams that need reliable technical
            judgment before they commit time or budget.
          </p>
        </div>
      </section>
    </div>
  );
}
