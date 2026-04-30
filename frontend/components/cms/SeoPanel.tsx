"use client";

import { useFormContext } from "react-hook-form";
import { Globe, Search, Link as LinkIcon, Image as ImageIcon, Tag, AlertCircle } from "lucide-react";

interface SeoPanelProps {
  title?: string;
  slug?: string;
  excerpt?: string;
}

export default function SeoPanel({ title = "", slug = "", excerpt = "" }: SeoPanelProps) {
  const { register, watch, formState: { errors } } = useFormContext();

  const metaTitle = watch("meta_title") || "";
  const metaDescription = watch("meta_description") || "";
  const canonicalUrl = watch("canonical_url") || "";
  const ogImage = watch("og_image") || "";
  const keywords = watch("keywords") || "";

  const displayTitle = metaTitle || title || "Título do Artigo";
  const displayDescription = metaDescription || excerpt || "Descrição do artigo...";
  const displayUrl = `https://conexaoai.com/blog/${slug || "slug-do-artigo"}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
        <Globe className="w-5 h-5 text-emerald-600" />
        SEO & Metadados
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Meta Title
            <span className={`ml-2 text-xs ${metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
              {metaTitle.length}/70 caracteres
            </span>
          </label>
          <input
            type="text"
            {...register("meta_title")}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Título para motores de busca"
          />
          {errors.meta_title && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.meta_title.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Meta Description
            <span className={`ml-2 text-xs ${metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
              {metaDescription.length}/160 caracteres
            </span>
          </label>
          <textarea
            rows={2}
            {...register("meta_description")}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Descrição breve para resultados de pesquisa"
          />
          {errors.meta_description && (
            <p className="mt-1 text-xs text-red-500">{errors.meta_description.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Tag className="w-3.5 h-3.5 inline mr-1" />
            Keywords
          </label>
          <input
            type="text"
            {...register("keywords")}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="palavra1, palavra2, palavra3"
          />
          <p className="text-xs text-slate-400 mt-1">Separe as keywords por vírgula</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
            Canonical URL
          </label>
          <input
            type="url"
            {...register("canonical_url")}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="https://exemplo.com/artigo-original"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
            OG Image (Open Graph)
          </label>
          <input
            type="text"
            {...register("og_image")}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="URL da imagem para partilha social"
          />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
            <Search className="w-4 h-4 text-blue-600" />
            Pré-visualização (Google)
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-blue-800 text-lg hover:underline cursor-pointer font-medium">
              {displayTitle}
            </div>
            <div className="text-green-700 text-xs mt-1">
              {displayUrl}
            </div>
            <div className="text-slate-600 text-sm mt-1 leading-relaxed">
              {displayDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
