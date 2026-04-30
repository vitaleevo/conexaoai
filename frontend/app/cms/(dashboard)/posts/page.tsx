"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus, Filter, FileText, CheckCircle2, Clock, CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { cmsFetch } from "@/lib/cms-api";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/cms/ConfirmDialog";

interface CmsPost {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "review";
  published_at: string | null;
  category_name: string | null;
  author_name: string;
  is_featured: boolean;
  created_at: string;
}

interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CmsPost[];
}

const PAGE_SIZE = 15;

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  published: {
    label: "Publicado",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  draft: {
    label: "Rascunho",
    icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />,
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  scheduled: {
    label: "Agendado",
    icon: <CalendarDays className="w-3 h-3" />,
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  review: {
    label: "Em Revisão",
    icon: <Clock className="w-3 h-3" />,
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `${diffDays}d atrás`;
}

export default function CmsPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();

  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CmsPost | null>(null);

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: PAGE_SIZE.toString(),
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    cmsFetch<PostsResponse>(`/posts/?${params.toString()}`)
      .then((data) => {
        if (!cancelled) {
          setPosts(data.results);
          setTotalCount(data.count);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar artigos.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, search, status]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/cms/posts?${params.toString()}`);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await cmsFetch(`/posts/${deleteTarget.id}/`, { method: "DELETE" });
      success("Artigo eliminado", `"${deleteTarget.title}" foi removido com sucesso.`);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotalCount((prev) => prev - 1);
      setDeleteTarget(null);
    } catch (err: unknown) {
      showError("Erro ao eliminar", err instanceof Error ? err.message : "Não foi possível eliminar o artigo.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Artigos</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {totalCount} {totalCount === 1 ? "artigo encontrado" : "artigos encontrados"}
          </p>
        </div>
        <Link
          href="/cms/posts/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          Escrever Artigo
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título ou conteúdo..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", (e.target as HTMLInputElement).value);
              }
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 bg-transparent placeholder:text-slate-400 font-medium text-slate-900"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Estado:</label>
            <select
              value={status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
              <option value="scheduled">Agendado</option>
              <option value="review">Em Revisão</option>
            </select>
          </div>
          {(search || status) && (
            <button
              onClick={() => router.push("/cms/posts")}
              className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Artigo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                      A carregar artigos...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-rose-500 font-medium bg-rose-50/50">
                    {error}
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Nenhum artigo encontrado</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Comece por criar o seu primeiro conteúdo.</p>
                    <Link href="/cms/posts/new" className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
                      Criar novo artigo &rarr;
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const config = statusConfig[post.status] ?? statusConfig.draft;
                  return (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          <Link href={`/cms/posts/${post.id}/edit`}>{post.title}</Link>
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {post.category_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {post.author_name || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {timeAgo(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/cms/posts/${post.id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && posts.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalCount)} de {totalCount}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <button
                  onClick={() => updateFilter("page", (page - 1).toString())}
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium bg-white hover:bg-slate-50"
                >
                  Anterior
                </button>
              ) : (
                <button disabled className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-300 font-medium bg-white cursor-not-allowed">
                  Anterior
                </button>
              )}
              {page < totalPages ? (
                <button
                  onClick={() => updateFilter("page", (page + 1).toString())}
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium bg-white hover:bg-slate-50"
                >
                  Próxima
                </button>
              ) : (
                <button disabled className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-300 font-medium bg-white cursor-not-allowed">
                  Próxima
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar artigo"
        description={`Tem certeza que deseja eliminar "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}
