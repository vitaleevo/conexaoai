import Link from "next/link";

import { BrandLogo } from "./BrandLogo";
import { Nav } from "./Nav";
import { SearchForm } from "./SearchForm";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,255,255,0.96)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo className="h-7 w-auto sm:h-8" priority variant="mark" />
          <div className="hidden lg:block lg:w-full lg:max-w-xl">
            <SearchForm variant="header" />
          </div>
          <Link
            className="hidden rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface)] sm:inline-flex"
            href="/newsletter"
          >
            Subscribe
          </Link>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Nav />
          <div className="lg:hidden">
            <SearchForm variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
}
