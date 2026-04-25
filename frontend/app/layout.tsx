import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: {
    default: "Conexao AI — AI, Business & Systems for the Modern Internet",
    template: "%s | Conexao AI",
  },
  description:
    "Direct insights, deep guides and practical systems for teams building with AI, business leverage and internet operations.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://conexao.ai"),
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    shortcut: ["/brand/logo-mark.png"],
    apple: ["/brand/logo-full.png"],
  },
  openGraph: {
    siteName: "Conexao AI",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-default.png",
        width: 731,
        height: 499,
        alt: "Conexao AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Conexao AI",
  url: "https://conexao.ai",
  image: "https://conexao.ai/og-default.png",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://conexao.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        <JsonLd data={websiteSchema} />
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
