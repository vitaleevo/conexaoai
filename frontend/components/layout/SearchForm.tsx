import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFormProps = {
  buttonLabel?: string;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: "header" | "hero" | "page";
};

const styles = {
  header: {
    form: "relative flex items-center w-full",
    input: "h-10 pr-10 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-input",
    button: "absolute right-1 size-8 rounded-full",
  },
  hero: {
    form: "flex flex-col gap-3 sm:flex-row",
    input: "h-14 flex-1",
    button: "h-14 px-8",
  },
  page: {
    form: "flex flex-col gap-3 sm:flex-row",
    input: "h-12 flex-1",
    button: "h-12 px-6",
  },
} as const;

export function SearchForm({
  buttonLabel = "Buscar",
  className = "",
  defaultValue = "",
  placeholder = "Buscar IA, negócios, ferramentas e guias...",
  variant = "page",
}: SearchFormProps) {

  const current = styles[variant];

  return (
    <form action="/search" className={`${current.form} ${className}`}>
      <Input
        aria-label="Search articles"
        className={current.input}
        defaultValue={defaultValue}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <Button 
        className={current.button} 
        type="submit" 
        size={variant === "header" ? "icon" : "default"}
        variant={variant === "hero" ? "default" : "secondary"}
      >
        {variant === "header" ? (
          <SearchIcon className="size-4" />
        ) : (
          buttonLabel
        )}
      </Button>
    </form>
  );
}
