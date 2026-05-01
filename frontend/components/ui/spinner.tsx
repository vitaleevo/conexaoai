import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  return (
    <span
      aria-label="Loading"
      role="status"
      className={cn(
        "inline-block animate-spin rounded-full border-muted border-t-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}
