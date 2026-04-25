import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.16em] text-[var(--accent-strong)]">404</p>
      <h1 className="font-display text-5xl leading-[0.98]">This page does not exist.</h1>
      <p className="text-lg leading-8 text-[var(--muted)]">
        The link may be broken, or the content has not been published yet.
      </p>
      <Link className="text-sm font-semibold text-[var(--accent-strong)]" href="/">
        Back to homepage
      </Link>
    </div>
  );
}
