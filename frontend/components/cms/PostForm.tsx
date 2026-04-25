"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Settings, Tag, Globe, ArrowLeft, Loader2, FileText, Eye, Edit3 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cmsFetch } from "@/lib/cms-api";

interface Category { id: number; name: string; }
interface Author { id: number; user: { username: string }; }

interface PostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: string;
  category?: string | number;
  author?: string | number;
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
}

interface PostFormProps {
  initialData?: PostData;
  postId?: string;
}

export default function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [categoryId, setCategoryId] = useState(initialData?.category ? String(initialData.category) : "");
  const [authorId, setAuthorId] = useState(initialData?.author ? String(initialData.author) : "");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);

  useEffect(() => {
    // Load metadata for selects
    async function loadFormMetadata() {
      try {
        const [catRes, authRes] = await Promise.all([
          cmsFetch<{results?: Category[]} | Category[]>("/categories/"),
          cmsFetch<{results?: Author[]} | Author[]>("/authors/")
        ]);
        setCategories('results' in catRes && Array.isArray(catRes.results) ? catRes.results : (Array.isArray(catRes) ? catRes : []));
        setAuthors('results' in authRes && Array.isArray(authRes.results) ? authRes.results : (Array.isArray(authRes) ? authRes : []));
      } catch (error) {
        console.error("Failed to load metadata", error);
      }
    }
    loadFormMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      title,
      slug: slug || undefined, // backend auto-generates if empty
      excerpt,
      content,
      status,
      category: categoryId ? parseInt(categoryId) : null,
      author: authorId ? parseInt(authorId) : null,
      meta_title: metaTitle,
      meta_description: metaDescription,
      is_featured: isFeatured,
    };

    try {
      if (postId) {
        await cmsFetch(`/posts/${postId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await cmsFetch(`/posts/`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/cms/posts");
      router.refresh();
    } catch (error) {
      alert("Erro ao guardar o post. Verifique os dados.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/cms/posts" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {postId ? "Editar Artigo" : "Criar Novo Artigo"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-sm font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conteúdo Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <FileText className="w-5 h-5 text-emerald-600" />
              Conteúdo Principal
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título do Artigo</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: Como a IA está a revolucionar a produtividade..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-slate-600"
                  placeholder="Deixar em branco para auto-gerar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo (Excerpt)</label>
                <textarea 
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Breve resumo do artigo (usado também na meta description fallback)"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Corpo do Artigo (Markdown/Texto)</label>
                  <button 
                    type="button" 
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    {isPreview ? <><Edit3 className="w-3.5 h-3.5" /> Editar</> : <><Eye className="w-3.5 h-3.5" /> Preview</>}
                  </button>
                </div>
                {isPreview ? (
                  <div className="w-full h-[360px] overflow-y-auto px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 prose prose-sm sm:prose-base max-w-none prose-emerald">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*Nenhum conteúdo escrito ainda.*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea 
                    required
                    rows={16}
                    value={content as string}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-sm px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    placeholder="Escreva o conteúdo do seu artigo em Markdown..."
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* SEO Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Globe className="w-5 h-5 text-emerald-600" />
              SEO & Metadados
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                <textarea 
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Estrutura Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Tag className="w-5 h-5 text-emerald-600" />
              Estrutura
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
                <select 
                  required
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecionar autor...</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.user.username}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Publicação Settings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Settings className="w-5 h-5 text-emerald-600" />
              Publicação
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-slate-700 font-medium">Destacar na Home</label>
              </div>
            </div>
          </div>

          {/* Media Placeholder */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">Imagem Destacada</h3>
            <p className="text-xs text-slate-500 mt-1">A gestão de media Cloudinary será ativada na V2.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
