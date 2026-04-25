import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]",
    secondary: "border border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[var(--surface)]",
  };

  return (
    <button
      className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
