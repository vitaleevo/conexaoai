export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conexao.ai";
  return `${base}${path}`;
}

export type ArticleHeading = {
  id: string;
  level: "h2" | "h3";
  text: string;
};

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

export function slugifyText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildArticleContentModel(html: string): {
  headings: ArticleHeading[];
  html: string;
} {
  const headings: ArticleHeading[] = [];
  const seenIds = new Map<string, number>();

  const processedHtml = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const text = stripHtml(inner);
    if (!text) {
      return match;
    }

    const existingIdMatch = attrs.match(/\sid=(["'])(.*?)\1/i);
    const rawId = existingIdMatch?.[2] || slugifyText(text) || `section-${headings.length + 1}`;
    const count = seenIds.get(rawId) ?? 0;
    seenIds.set(rawId, count + 1);
    const id = count === 0 ? rawId : `${rawId}-${count + 1}`;

    headings.push({
      id,
      level: tag.toLowerCase() as ArticleHeading["level"],
      text,
    });

    if (existingIdMatch) {
      return match.replace(existingIdMatch[0], ` id="${id}"`);
    }

    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  return {
    headings,
    html: processedHtml,
  };
}

export function extractFaqFromHtml(html: string): Array<{ question: string; answer: string }> {
  const faqMatch = html.match(
    /<(h2|h3)[^>]*>\s*(faq|perguntas frequentes)[^<]*<\/\1>([\s\S]*)/i,
  );
  if (!faqMatch) {
    return [];
  }

  const section = faqMatch[3];
  const qaPattern = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  const faqs: Array<{ question: string; answer: string }> = [];
  let match: RegExpExecArray | null = qaPattern.exec(section);

  while (match && faqs.length < 6) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);
    if (question && answer) {
      faqs.push({ question, answer });
    }
    match = qaPattern.exec(section);
  }

  return faqs;
}
