"use client";

import { useEffect, useState } from "react";
import { Search, Filter, User as UserIcon } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface Author {
  id: number;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  bio: string;
  website: string;
  twitter: string;
}

export default function CmsAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const data = await cmsFetch<{results: Author[]} | Author[]>("/authors/");
        setAuthors('results' in data && Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Autores</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gira os perfis de quem escreve no blog.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar autores..." 
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 bg-transparent placeholder:text-slate-400 font-medium text-slate-900"
          />
        </div>
        <div className="w-full sm:w-px h-px sm:h-6 bg-slate-200"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nome / Email</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Bio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">A carregar autores...</td>
                </tr>
              ) : authors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <UserIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Nenhum autor encontrado.</p>
                  </td>
                </tr>
              ) : (
                authors.map((author) => {
                  const fullName = `${author.user.first_name} ${author.user.last_name}`.trim();
                  return (
                    <tr key={author.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{fullName || "Sem Nome"}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{author.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {author.user.username}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {author.bio || "Sem biografia."}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
