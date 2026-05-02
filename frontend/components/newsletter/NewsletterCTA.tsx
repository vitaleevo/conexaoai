import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-background p-8 md:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 blur-[120px] opacity-20">
            <div className="size-64 rounded-full bg-primary" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-4 text-primary" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Weekly Intelligence
                </p>

              </div>
               <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-6xl">
                 Get the next clear analysis before everyone else.
               </h2>

               <p className="text-lg leading-8 text-muted-foreground">
                 Weekly insights on AI, business systems, tools and internet operations,
                 with zero visual noise. Join more than 10,000 global operators.
               </p>

            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex h-12 sm:h-14 items-center justify-center rounded-xl bg-primary px-6 sm:px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 active:scale-[0.98]"
                href="/newsletter"
              >
                Join the Newsletter

              </Link>
              <Link
                className="group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 sm:px-8 text-sm font-bold text-foreground transition hover:bg-muted active:scale-[0.98]"
                href="/blog"
              >
                View examples

                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
