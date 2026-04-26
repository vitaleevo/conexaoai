import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  className?: string;
}

export function Pagination({
  totalPages,
  currentPage,
  baseUrl,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const url = new URL(baseUrl, "https://conexao.ai"); // Base dummy URL to parse
    url.searchParams.set("page", page.toString());
    return `${url.pathname}${url.search}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Page navigation"
      className={cn("flex items-center justify-center gap-2 py-10", className)}
    >
      {/* Previous Page */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-10 w-10 rounded-full",
          currentPage <= 1 && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="size-4" />
              </div>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={cn(
                buttonVariants({
                  variant: isCurrent ? "default" : "outline",
                  size: "icon",
                }),
                "h-10 w-10 rounded-full font-bold transition-all duration-300",
                isCurrent && "shadow-lg shadow-primary/20"
              )}
              aria-current={isCurrent ? "page" : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Page */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-10 w-10 rounded-full",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next</span>
      </Link>
    </nav>
  );
}
