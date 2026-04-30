import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ConexãoAI — IA, Negócios e Sistemas para a Internet Moderna",
    template: "%s | ConexãoAI",
  },
  description:
    "Insights diretos, guias práticos e sistemas para equipes construindo com IA, alavancagem de negócios e operações na internet.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://conexao.ai"),
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    shortcut: ["/brand/logo-mark.png"],
    apple: ["/brand/logo-full.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    siteName: "ConexãoAI",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "ConexãoAI — Inteligência para Operadores Globais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
    title: "ConexãoAI — Inteligência para Operadores Globais",
    description: "Insights diretos, análise estruturada e guias densos para a elite operacional moderna.",
  },
  robots: { index: true, follow: true },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ConexãoAI",
  url: "https://conexao.ai",
  image: "https://conexao.ai/og-default.png",
  inLanguage: "pt-BR",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://conexao.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

import { BehavioralTracker } from "@/components/analytics/BehavioralTracker";
import { MobileNav } from "@/components/layout/MobileNav";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import PostHogPageView from "@/components/providers/PostHogPageView";
import { Suspense } from "react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="font-sans">
        <PostHogProvider>
          <BehavioralTracker />
          <JsonLd data={websiteSchema} />
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col bg-background">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <MobileNav />
            </div>
          </TooltipProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

