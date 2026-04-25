"use client";

import { useEffect, useState } from "react";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface MediaAsset {
  id: number;
  file: string;
  description: string;
  created_at: string;
}

export default function CmsMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  async function loadMedia() {
    setIsLoading(true);
    try {
      const data = await cmsFetch<{results: MediaAsset[]} | MediaAsset[]>("/media/");
      setMedia('results' in data && Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", file.name);

    try {
      await cmsFetch("/media/", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });
      
      loadMedia();
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem a certeza que deseja eliminar esta imagem?")) return;
    try {
      await cmsFetch(`/media/${id}/`, { method: "DELETE" });
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao eliminar a imagem");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Biblioteca de Media</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Imagens e ficheiros enviados para o Cloudinary.</p>
        </div>
        <div>
          <label className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? "A enviar..." : "Upload Imagem"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">A carregar...</div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">Nenhuma media encontrada</h3>
            <p className="text-slate-500 mt-1">Faça o upload da sua primeira imagem para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media.map((asset) => (
              <div key={asset.id} className="group relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.file} alt={asset.description} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-xs text-white truncate mb-2">{asset.description}</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { navigator.clipboard.writeText(asset.file); alert('URL copiado!') }}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 rounded transition-colors backdrop-blur-sm"
                    >
                      Copiar URL
                    </button>
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded transition-colors backdrop-blur-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
