"use client";

import { Bell, LogOut, Plus, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCmsTokens } from "@/lib/cms-api";

export default function CmsHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearCmsTokens();
    router.replace("/cms/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-2">
        {/* Breadcrumbs can go here in the future */}
        <span className="text-sm font-medium text-slate-500">Backoffice Editorial</span>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/cms/posts/new"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Post
        </Link>
        
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        
        <button className="text-slate-500 hover:text-slate-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>
        
        <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
          <UserCircle className="w-7 h-7 text-slate-300" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Terminar sessão"
          title="Terminar sessão"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
