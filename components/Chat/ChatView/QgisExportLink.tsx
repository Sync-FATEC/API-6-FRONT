"use client";

import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import { Button } from "@/components/Button";
import { IQgisUrlGrupo } from "@/interfaces/services/QueryService";
import Tooltip from "@/components/Tooltip";

import { getProjectBaseUrl } from "@/utils/api";

interface Props {
  url?: string | null;
  urlsGrupos?: IQgisUrlGrupo[] | null;
}

const ABSOLUTE_RE = /^https?:\/\//i;

const buildAbsolute = (url: string): string => {
  if (ABSOLUTE_RE.test(url)) return url;
  const base = getProjectBaseUrl();
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

export default function QgisExportLink({ url, urlsGrupos }: Props) {
  const [copiado, setCopiado] = useState(false);

  const principalAbs = url ? buildAbsolute(url) : null;
  const gruposAbs = (urlsGrupos ?? []).map((g) => buildAbsolute(g.url));

  const hasContent = !!principalAbs || gruposAbs.length > 0;
  if (!hasContent) return null;

  const handleCopy = async () => {
    try {
      const target = principalAbs || (gruposAbs.length > 0 ? gruposAbs.join("\n") : "");

      if (!target) return;

      await navigator.clipboard.writeText(target);
      setCopiado(true);
      toast.success("URL copiado", {
        description: "Cole no QGIS em Layer > Add Vector Layer > Protocol HTTP(S).",
      });
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Falha ao copiar", { description: "Tente novamente." });
    }
  };

  return (
    <Tooltip content="Copiar URL QGIS">
      <Button
        variant="plain"
        size="sm"
        onClick={handleCopy}
        className={` font-medium transition-colors px-2 ${
          copiado ? "text-success bg-success-50" : "text-slate-500 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <Icon name={copiado ? "check" : "copy"} size={18} />
      </Button>
    </Tooltip>
  );
}
