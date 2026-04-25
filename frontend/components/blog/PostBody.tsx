export function PostBody({ html }: { html: string }) {
  return <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
