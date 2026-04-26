"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, Mail, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Topics", href: "/#categories", icon: Grid },
  { label: "Search", href: "/search", icon: Search },
  { label: "Digest", href: "/newsletter", icon: Mail },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 pb-safe backdrop-blur-lg md:hidden">
      <nav className="flex items-center justify-around px-2 py-3">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                isActive ? "bg-primary/10 shadow-sm" : "hover:bg-muted"
              )}>
                <item.icon className={cn("size-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-wider uppercase transition-colors",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
