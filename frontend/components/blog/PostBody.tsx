import DOMPurify from "isomorphic-dompurify";

export function PostBody({ html }: { html: string }) {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
