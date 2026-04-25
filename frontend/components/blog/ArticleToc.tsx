import type { ArticleHeading } from "@/lib/utils";

export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  if (!headings.length) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-lg border border-[var(--line)] bg-white p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
        On this page
      </p>
      <ol className="mt-4 space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              className={`block text-sm leading-6 text-[var(--muted)] transition hover:text-[var(--foreground)] ${
                heading.level === "h3" ? "pl-4" : ""
              }`}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
