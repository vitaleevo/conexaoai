"use client";

import { useCallback, useState } from "react";
import { Wand2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  maxLength?: number;
  className?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

export function SlugField({
  value,
  onChange,
  title,
  maxLength = 200,
  className,
}: SlugFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    if (title) {
      onChange(generateSlug(title));
    }
  }, [title, onChange]);

  const handleCopy = useCallback(async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  const isOverLimit = value.length > maxLength;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          Slug
        </label>
        {title && (
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Wand2 className="w-3 h-3" />
            Gerar a partir do título
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(generateSlug(e.target.value));
            }}
            placeholder="meu-artigo-incrivel"
            className={cn(
              "w-full px-3 py-2 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors",
              isOverLimit
                ? "border-red-300 bg-red-50 text-red-700"
                : value
                  ? "border-slate-200"
                  : "border-slate-200"
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
              title="Copiar slug"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* URL Preview */}
      {value && (
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span className="font-mono">/blog/</span>
          <span className="font-mono text-emerald-600">{value}</span>
        </div>
      )}

      {/* Validation Messages */}
      {isOverLimit && (
        <p className="text-xs text-red-500">
          Slug excede o limite de {maxLength} caracteres ({value.length})
        </p>
      )}
      {!value && (
        <p className="text-xs text-slate-400">
          Será gerado automaticamente ou clique em &quot;Gerar a partir do título&quot;
        </p>
      )}

      {/* Character counter */}
      <div className="flex items-center justify-end">
        <span className={cn(
          "text-xs",
          isOverLimit ? "text-red-500" : "text-slate-400"
        )}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
