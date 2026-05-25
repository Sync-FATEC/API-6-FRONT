"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/Button";
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
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const principalAbs = url ? buildAbsolute(url) : null;
  const gruposAbs = (urlsGrupos ?? []).map((g, idx) => ({
    rotulo: g.rotulo,
    url: buildAbsolute(g.url),
    id: `grupo-${idx}`,
  }));

  const hasContent = !!principalAbs || gruposAbs.length > 0;
  if (!hasContent) return null;

  const handleCopy = async (urlToCopy: string, id: string) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopiadoId(id);
      
      const isGrupo = id.startsWith("grupo");
      toast.success("URL copiada", {
        description: isGrupo
          ? "Cole no QGIS em Layer > Add Vector Layer > Protocol HTTP(S)."
          : "Camada principal",
      });
      
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      toast.error("Falha ao copiar", { description: "Tente novamente." });
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Abrir no QGIS</h3>
        {gruposAbs.length > 1 && (
          <p className="text-sm text-slate-500">{gruposAbs.length} camadas disponíveis</p>
        )}
      </div>

      {principalAbs && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-slate-50 p-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">Camada principal</p>
            <a
              href={principalAbs}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir GeoJSON em nova aba"
              className="text-xs text-blue-600 hover:underline truncate"
            >
              {principalAbs}
            </a>
          </div>
          <Button
            variant="plain"
            size="sm"
            onClick={() => handleCopy(principalAbs, "principal")}
            className={`ml-2 font-medium transition-colors px-2 ${
              copiadoId === "principal"
                ? "text-success bg-success-50"
                : "text-slate-500 bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {copiadoId === "principal" ? "Copiado" : "Copiar URL"}
          </Button>
        </div>
      )}

      {gruposAbs.length > 0 && (
        <div className="space-y-2">
          {gruposAbs.map((grupo) => (
            <div key={grupo.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{grupo.rotulo}</p>
                <a
                  href={grupo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir GeoJSON em nova aba"
                  className="text-xs text-blue-600 hover:underline truncate"
                >
                  {grupo.url}
                </a>
              </div>
              <Button
                variant="plain"
                size="sm"
                onClick={() => handleCopy(grupo.url, grupo.id)}
                className={`ml-2 font-medium transition-colors px-2 ${
                  copiadoId === grupo.id
                    ? "text-success bg-success-50"
                    : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {copiadoId === grupo.id ? "Copiado" : "Copiar URL"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
