"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Tags, Users, TrendingUp, Loader2 } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";
import ActivityHeatmap from "@/components/cms/ActivityHeatmap";
import BehavioralHeatmap from "@/components/cms/BehavioralHeatmap";

interface DashboardStats {
  posts: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    review: number;
    this_week: number;
    this_month: number;
  };
  categories: {
    total: number;
    active: number;
  };
  tags: {
    total: number;
  };
  subscribers: {
    total: number;
    active: number;
    this_month: number;
  };
  media: {
    total: number;
  };
  recent_posts: {
    id: number;
    title: string;
    status: string;
    created_at: string;
    published_at: string | null;
    author: string;
    category: string | null;
  }[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora mesmo";
  if (diffMins < 60) return `Há ${diffMins}min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  return `Há ${diffDays}d`;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  published: { label: "Publicado", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  draft: { label: "Rascunho", color: "bg-slate-50 text-slate-600 border-slate-200" },
  scheduled: { label: "Agendado", color: "bg-blue-50 text-blue-700 border-blue-100" },
  review: { label: "Em Revisão", color: "bg-amber-50 text-amber-700 border-amber-100" },
};

export default function CmsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cmsFetch<DashboardStats>("/stats/")
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-medium">Erro ao carregar dashboard</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Posts Publicados",
      value: stats.posts.published.toString(),
      icon: FileText,
      change: `+${stats.posts.this_week} na última semana`,
    },
    {
      label: "Posts em Rascunho",
      value: stats.posts.draft.toString(),
      icon: FileText,
      change: `${stats.posts.review} em revisão`,
    },
    {
      label: "Categorias",
      value: stats.categories.total.toString(),
      icon: Tags,
      change: `${stats.categories.active} ativas`,
    },
    {
      label: "Subscritores",
      value: stats.subscribers.total.toLocaleString("pt-BR"),
      icon: Users,
      change: `+${stats.subscribers.this_month} este mês`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <div className="text-sm text-slate-500 font-medium">Bem-vindo(a) ao Backoffice Editorial</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className="p-2 bg-slate-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <ActivityHeatmap />
        <BehavioralHeatmap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Últimos Posts</h2>
          {stats.recent_posts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Nenhum post criado ainda</p>
              <Link href="/cms/posts/new" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-block">
                Criar primeiro post →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recent_posts.map((post) => {
                const statusConfig = statusLabels[post.status] ?? { label: post.status, color: "bg-slate-50 text-slate-600 border-slate-200" };
                return (
                  <div key={post.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{post.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {timeAgo(post.created_at)} • Por {post.author}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <Link href={`/cms/posts/${post.id}/edit`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Editar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link href="/cms/posts/new" className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Escrever Novo Artigo
            </Link>
            <Link href="/cms/categories" className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Gerir Categorias
            </Link>
            <Link href="/cms/newsletter" className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Ver Subscritores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
