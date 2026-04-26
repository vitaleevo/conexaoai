import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewsletterForm } from "./NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Newsletter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.16em] text-primary">Newsletter</p>
        <h1 className="font-display text-4xl leading-[0.98] sm:text-5xl">
          A weekly briefing for sharper AI decisions.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Short analysis, relevant reads and practical translation of what actually matters in AI,
          product, tools and automation.
        </p>
      </section>
      <NewsletterForm />
    </div>
  );
}
