"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface Subscriber {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  confirmed: boolean;
  subscribed_at: string;
}

export default function CmsNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubscribers() {
      try {
        const data = await cmsFetch<{results: Subscriber[]} | Subscriber[]>("/newsletter/");
        setSubscribers('results' in data && Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubscribers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Newsletter</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gira os seus subscritores e as suas preferências.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar subscritores..." 
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
                <th className="px-6 py-4">Email / Nome</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Confirmado</th>
                <th className="px-6 py-4">Data Subscrição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">A carregar subscritores...</td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Mail className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Nenhum subscritor encontrado.</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{sub.email}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{sub.name || "Sem Nome"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Ativo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700">Inativo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {sub.confirmed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(sub.subscribed_at).toLocaleDateString("pt-PT")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
