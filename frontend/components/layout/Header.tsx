import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Nav } from "./Nav";
import { SearchForm } from "./SearchForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <BrandLogo />
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block lg:w-64">
            <SearchForm variant="header" />
          </div>
          <Link href="/newsletter" className={buttonVariants({ className: "hidden sm:inline-flex rounded-full px-6" })}>
            Assinar
          </Link>

        </div>
      </div>
    </header>
  );
}
