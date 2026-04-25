type SearchFormProps = {
  buttonLabel?: string;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: "header" | "hero" | "page";
};

const styles = {
  header: {
    form: "flex flex-col gap-3 sm:flex-row",
    input:
      "h-11 flex-1 rounded-lg border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]",
    button:
      "inline-flex h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]",
  },
  hero: {
    form: "flex flex-col gap-3 sm:flex-row",
    input:
      "h-14 flex-1 rounded-lg border border-[var(--line)] bg-white px-5 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]",
    button:
      "inline-flex h-14 items-center justify-center rounded-lg bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]",
  },
  page: {
    form: "flex flex-col gap-3 sm:flex-row",
    input:
      "h-12 flex-1 rounded-lg border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]",
    button:
      "inline-flex h-12 items-center justify-center rounded-lg bg-[var(--foreground)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]",
  },
} as const;

export function SearchForm({
  buttonLabel = "Search",
  className = "",
  defaultValue = "",
  placeholder = "Search AI, business, tools and guides...",
  variant = "page",
}: SearchFormProps) {
  const current = styles[variant];

  return (
    <form action="/search" className={`${current.form} ${className}`}>
      <input
        aria-label="Search articles"
        className={current.input}
        defaultValue={defaultValue}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <button className={current.button} type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}
