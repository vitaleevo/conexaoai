import type { Metadata } from "next";

export function buildOpenGraph({
  title,
  description,
  path = "/",
  image = "/og-default.png",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conexao.ai";
  const url = `${siteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
