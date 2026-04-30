"use client";

import { useCallback, useState } from "react";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image,
  Eye, EyeOff, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function ToolbarButton({ icon: Icon, label, onClick, active }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900",
        active && "bg-slate-100 text-slate-900"
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function insertText(textarea: HTMLTextAreaElement, before: string, after = "") {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const newText = textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end);
  return { value: newText, cursorPos: start + before.length + selectedText.length };
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva seu conteúdo em Markdown...",
  className,
  minRows = 8,
  maxRows = 24,
}: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const handleInsert = useCallback(
    (before: string, after = "") => {
      if (!textareaRef) return;
      const { value: newValue, cursorPos } = insertText(textareaRef, before, after);
      onChange(newValue);
      setTimeout(() => {
        textareaRef.focus();
        textareaRef.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    },
    [textareaRef, onChange]
  );

  const handleLink = useCallback(() => {
    const url = prompt("URL do link:");
    if (url) {
      handleInsert("[", `](${url})`);
    }
  }, [handleInsert]);

  const handleImage = useCallback(() => {
    const url = prompt("URL da imagem:");
    if (url) {
      handleInsert("![", `](${url})`);
    }
  }, [handleInsert]);

  const lines = value.split("\n").length;
  const rowCount = Math.max(minRows, Math.min(lines, maxRows));

  return (
    <div className={cn("border border-slate-200 rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-200 bg-slate-50 flex-wrap">
        <ToolbarButton icon={Bold} label="Negrito (Ctrl+B)" onClick={() => handleInsert("**", "**")} />
        <ToolbarButton icon={Italic} label="Itálico (Ctrl+I)" onClick={() => handleInsert("*", "*")} />
        <ToolbarButton icon={Strikethrough} label="Tachado" onClick={() => handleInsert("~~", "~~")} />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarButton icon={Heading1} label="Título 1" onClick={() => handleInsert("# ")} />
        <ToolbarButton icon={Heading2} label="Título 2" onClick={() => handleInsert("## ")} />
        <ToolbarButton icon={Heading3} label="Título 3" onClick={() => handleInsert("### ")} />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarButton icon={List} label="Lista" onClick={() => handleInsert("- ")} />
        <ToolbarButton icon={ListOrdered} label="Lista numerada" onClick={() => handleInsert("1. ")} />
        <ToolbarButton icon={Quote} label="Citação" onClick={() => handleInsert("> ")} />
        <ToolbarButton icon={Code} label="Código inline" onClick={() => handleInsert("`", "`")} />
        <ToolbarButton icon={Minus} label="Separador" onClick={() => handleInsert("\n---\n")} />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarButton icon={LinkIcon} label="Link" onClick={handleLink} />
        <ToolbarButton icon={Image} label="Imagem" onClick={handleImage} />

        <div className="ml-auto">
          <ToolbarButton
            icon={preview ? EyeOff : Eye}
            label={preview ? "Editar" : "Pré-visualizar"}
            onClick={() => setPreview(!preview)}
            active={preview}
          />
        </div>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div className="p-4 prose prose-slate max-w-none min-h-[200px] bg-white">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
          ) : (
            <p className="text-slate-400 italic">Nada para pré-visualizar...</p>
          )}
        </div>
      ) : (
        <textarea
          ref={setTextareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rowCount}
          className="w-full px-4 py-3 text-sm font-mono bg-white text-slate-900 placeholder:text-slate-400 border-none focus:ring-0 resize-y"
        />
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
        <span>Markdown suportado</span>
        <span>{value.split(/\s+/).filter(Boolean).length} palavras</span>
      </div>
    </div>
  );
}

function renderMarkdown(text: string): string {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 rounded text-sm font-mono text-rose-600">$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 hover:underline">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full" />');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-slate-200 pl-4 italic text-slate-600">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-6">$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-slate-200 my-4" />');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br />');

  return html;
}
