import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  href?: string;
  priority?: boolean;
  variant?: "full" | "mark";
};

const variants = {
  full: {
    alt: "Conexao AI",
    height: 499,
    src: "/brand/logo-full.png",
    width: 731,
    className: "h-14 w-auto sm:h-16",
  },
  mark: {
    alt: "Conexao AI",
    height: 297,
    src: "/brand/logo-mark.png",
    width: 403,
    className: "h-9 w-auto sm:h-10",
  },
} as const;

export function BrandLogo({
  className,
  href = "/",
  priority = false,
  variant = "full",
}: BrandLogoProps) {
  const logo = variants[variant];
  const imageClassName = className ?? logo.className;

  return (
    <Link className="inline-flex items-center" href={href}>
      <Image
        alt={logo.alt}
        className={imageClassName}
        height={logo.height}
        priority={priority}
        src={logo.src}
        width={logo.width}
      />
    </Link>
  );
}
