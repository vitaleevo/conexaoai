import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

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
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-GB": "/",
      "en-SG": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    siteName: "Conexao AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Conexao AI — Intelligence for Global Operators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
    title: "Conexao AI — Intelligence for Global Operators",
    description: "Direct insights, structured analysis and dense guides for the modern operational elite.",
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

import { BehavioralTracker } from "@/components/analytics/BehavioralTracker";
import { MobileNav } from "@/components/layout/MobileNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body suppressHydrationWarning>
        <BehavioralTracker />
        <JsonLd data={websiteSchema} />
        <TooltipProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
