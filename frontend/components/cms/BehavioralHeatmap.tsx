"use client";

import React, { useEffect, useState, useRef, useMemo, useReducer } from "react";
import { MousePointer2, RefreshCw, Layers } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface Click {
  x_percent: number;
  y_percent: number;
}

interface BehavioralHeatmapProps {
  path?: string;
  title?: string;
  showSelector?: boolean;
}

export default function BehavioralHeatmap({ 
  path: initialPath = "/", 
  title = "Mapa de Cliques (Behavioral)",
  showSelector = true
}: BehavioralHeatmapProps) {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(initialPath);
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPath(initialPath);
  }, [initialPath]);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setLoading(true);
      try {
        const data = await cmsFetch<Click[]>(`/click-stats/?path=${encodeURIComponent(path)}`);
        if (!cancelled) setClicks(data);
      } catch (error) {
        console.error("Failed to fetch click stats", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, [path, refreshKey]);

  // Pre-compute animation delays so they are stable across renders
  const animationDelays = useMemo(
    () => clicks.map((_, i) => `${(i * 0.13) % 2}s`),
    [clicks]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <MousePointer2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Visualização de Pontos Quentes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSelector && (
            <select 
              value={path} 
              onChange={(e) => setPath(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="/">Home Page</option>
              <option value="/blog">Blog List</option>
              <option value="/about">About</option>
            </select>
          )}
          <button 
            onClick={forceRefresh}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-50 overflow-hidden group">
        {/* The Actual Page Preview (Iframe) */}
        <iframe 
          src={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${path}`}
          className="w-[1280px] h-[800px] origin-top-left scale-[0.38] absolute inset-0 opacity-40 pointer-events-none"
          title="Heatmap Preview"
        />

        {/* The Heatmap Overlay */}
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
          {clicks.map((click, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full opacity-60 mix-blend-multiply transition-all duration-1000"
              style={{
                left: `${click.x_percent}%`,
                top: `${click.y_percent}%`,
                background: `radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(249, 115, 22, 0.4) 40%, rgba(250, 204, 21, 0) 70%)`,
                animationDelay: animationDelays[i],
              }}
            />
          ))}
          {/* Intense centers */}
          {clicks.map((click, i) => (
            <div
              key={`core-${i}`}
              className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
              style={{
                left: `${click.x_percent}%`,
                top: `${click.y_percent}%`,
              }}
            />
          ))}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
             <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg border border-slate-100">
               <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
               <span className="text-xs font-bold text-slate-700">A processar dados...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-medium">Amostra: <b className="text-slate-900">{clicks.length} cliques</b></span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500 blur-[1px]"></div>
            <span className="text-slate-500">Intensidade Alta</span>
          </div>
        </div>
        <span className="text-slate-400">Última atualização: Agora</span>
      </div>
    </div>
  );
}
