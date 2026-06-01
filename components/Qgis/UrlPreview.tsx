"use client";

import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";
import { Button } from "../Button";

interface Props {
  url: string;
  onDownload: () => void;
}

export default function UrlPreview({ url, onDownload }: Props) {
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
      <h3 className="text-sm font-medium text-slate-500 ">URL gerada</h3>

      <div className="relative rounded-md bg-slate-50 p-2">
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
            "absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-sm transition cursor-pointer",
            copiado
              ? "bg-success text-white"
              : "bg-white text-slate-500 hover:bg-primary hover:text-white shadow-sm"
          )}
        >
          <Icon name={copiado ? "check" : "copy"} size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button size="sm" onClick={handleCopy}>
          <Icon name="copy" size={18} />
          Copiar
        </Button>
        <Button size="sm" variant="soft" onClick={onDownload}>
          <Icon name="download" size={18} />
          Baixar
        </Button>
        <Button size="sm" variant="soft" onClick={handleOpen}>
          <Icon name="external-link" size={18} />
          Nova Aba
        </Button>
      </div>
    </section>
  );
}
