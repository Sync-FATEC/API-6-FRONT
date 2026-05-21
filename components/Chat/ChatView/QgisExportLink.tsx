"use client";

import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";
import { IQgisUrlGrupo } from "@/interfaces/services/QueryService";

interface Props {
  url?: string | null;
  urlsGrupos?: IQgisUrlGrupo[] | null;
}

const ABSOLUTE_RE = /^https?:\/\//i;

const buildAbsolute = (url: string): string => {
  if (ABSOLUTE_RE.test(url)) return url;
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
    (typeof window !== "undefined" ? "http://127.0.0.1:8000" : "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

export default function QgisExportLink({ url, urlsGrupos }: Props) {
  const [copiado, setCopiado] = useState<string | null>(null);

  const principalAbs = url ? buildAbsolute(url) : null;
  const gruposAbs = (urlsGrupos ?? []).map((g) => ({
    ...g,
    url: buildAbsolute(g.url),
  }));

  const hasContent = !!principalAbs || gruposAbs.length > 0;
  if (!hasContent) return null;

  const handleCopy = async (target: string, label: string) => {
    try {
      await navigator.clipboard.writeText(target);
      setCopiado(target);
      toast.success("URL copiada", {
        description: `${label} — cole no QGIS em Layer > Add Vector Layer > Protocol HTTP(S).`,
      });
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      toast.error("Falha ao copiar", { description: "Copie manualmente." });
    }
  };

  const isMultiplo = gruposAbs.length > 0;

  return (
    <div className="mt-3 rounded-xl border border-primary-100 bg-linear-to-br from-primary-50/60 to-white p-3 flex flex-col gap-2.5 animate-pop-in-up shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white shrink-0">
          <Icon name="world" size={13} />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold text-slate-800">Abrir no QGIS</span>
          <span className="text-[10px] text-slate-500">
            {isMultiplo
              ? `${gruposAbs.length} camadas disponíveis`
              : "Mesma camada exibida no mapa do chat"}
          </span>
        </div>
      </div>

      {principalAbs && !isMultiplo && (
        <QgisActionRow
          url={principalAbs}
          copiado={copiado === principalAbs}
          onCopy={() => handleCopy(principalAbs, "Camada principal")}
        />
      )}

      {isMultiplo && (
        <div className="flex flex-col gap-1.5">
          {gruposAbs.map((g, i) => (
            <QgisActionRow
              key={`${g.rotulo}-${i}`}
              titulo={g.rotulo || `Camada ${i + 1}`}
              url={g.url}
              copiado={copiado === g.url}
              onCopy={() => handleCopy(g.url, g.rotulo || `Camada ${i + 1}`)}
            />
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
        No QGIS, se aparecer o diálogo <strong>Selecionar Vetores</strong>,
        marque <strong>todas as sublayers</strong> (pontos, polígonos, multipolígonos)
        para ver tudo que aparece no mapa do chat.
      </p>
    </div>
  );
}

function QgisActionRow({
  url,
  copiado,
  onCopy,
  titulo,
}: {
  url: string;
  copiado: boolean;
  onCopy: () => void;
  titulo?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-white border border-slate-200 p-2">
      {titulo && (
        <span className="text-[11px] font-semibold text-slate-700 px-0.5">
          {titulo}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onCopy}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition cursor-pointer",
            copiado
              ? "bg-success-50 text-success"
              : "bg-primary text-white hover:bg-primary-600",
          )}
        >
          <Icon name={copiado ? "check" : "copy"} size={13} />
          {copiado ? "Copiado" : "Copiar URL"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir GeoJSON em nova aba"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
        >
          <Icon name="external-link" size={13} />
        </a>
      </div>
    </div>
  );
}
