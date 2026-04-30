"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewPaneProps {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  featuredImage?: string;
  readingTime?: number;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  review: "Em Revisão",
  published: "Publicado",
  scheduled: "Agendado",
};

export function PreviewPane({
  title,
  content,
  excerpt,
  author,
  category,
  status,
  featuredImage,
  readingTime,
  className,
  isFullscreen,
  onToggleFullscreen,
}: PreviewPaneProps) {
  const estimatedReadingTime = useMemo(() => {
    if (readingTime) return readingTime;
    if (!content) return 1;
    return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
  }, [content, readingTime]);

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Pré-visualização</span>
        </div>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            title={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-500" /> : <Maximize2 className="w-4 h-4 text-slate-500" />}
          </button>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <article className="prose prose-slate max-w-none p-6">
          {/* Meta Info */}
          <div className="mb-6 pb-4 border-b border-slate-100">
            {featuredImage && (
              <div className="mb-4 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt={title} className="w-full h-48 object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {category && (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                  {category}
                </span>
              )}
              {status && (
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                  {statusLabels[status] ?? status}
                </span>
              )}
              <span className="text-xs text-slate-400">{estimatedReadingTime} min de leitura</span>
            </div>

            {title ? (
              <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3">
                {title}
              </h1>
            ) : (
              <div className="h-8 bg-slate-100 rounded w-3/4 mb-3 animate-pulse" />
            )}

            {excerpt ? (
              <p className="text-slate-500 text-sm leading-relaxed italic mb-3">
                {excerpt}
              </p>
            ) : (
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-3 animate-pulse" />
            )}

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-medium text-slate-600">{author || "Autor"}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Content */}
          {content ? (
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-emerald-600 prose-img:rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-4/6 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-full animate-pulse mt-6" />
              <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse" />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
