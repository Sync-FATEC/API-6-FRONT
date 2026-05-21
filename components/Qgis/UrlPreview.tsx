"use client";

import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";

interface Props {
  url: string;
  onPreview: () => void;
  onDownload: () => void;
  loading?: boolean;
}

export default function UrlPreview({ url, onPreview, onDownload, loading }: Props) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      toast.success("URL copiada", {
        description: "Cole no QGIS em Layer > Add Vector Layer > Protocol HTTP(S).",
      });
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Falha ao copiar", { description: "Selecione e copie manualmente." });
    }
  };

  const handleOpen = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider px-0.5">
        URL gerada
      </h3>

      <div className="relative rounded-md border border-slate-200 bg-slate-50 p-2.5">
        <textarea
          readOnly
          value={url}
          rows={2}
          className="w-full bg-transparent text-[11px] font-mono text-slate-600 resize-none focus:outline-none break-all scrollbar-mini leading-relaxed pr-8"
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
        <button
          onClick={handleCopy}
          title="Copiar URL"
          className={cn(
            "absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md transition cursor-pointer",
            copiado
              ? "bg-success-50 text-success"
              : "bg-white text-slate-500 hover:bg-primary hover:text-white shadow-sm",
          )}
        >
          <Icon name={copiado ? "check" : "copy"} size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 rounded-md bg-primary text-white text-xs font-semibold py-2 hover:bg-primary-600 transition cursor-pointer"
        >
          <Icon name="copy" size={14} />
          Copiar
        </button>
        <button
          onClick={onPreview}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 rounded-md bg-primary-50 text-primary text-xs font-semibold py-2 hover:bg-primary-100 transition cursor-pointer disabled:opacity-50"
        >
          <Icon name="map" size={14} />
          {loading ? "..." : "Mapa"}
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold py-2 hover:bg-slate-200 transition cursor-pointer"
        >
          <Icon name="download" size={14} />
          Baixar
        </button>
      </div>

      <button
        onClick={handleOpen}
        className="text-[11px] text-slate-400 hover:text-primary self-start flex items-center gap-1 transition cursor-pointer"
      >
        <Icon name="external-link" size={12} />
        Abrir GeoJSON em nova aba
      </button>
    </section>
  );
}
