import React from "react";
import { renderToString } from "react-dom/server";
import Icon from "@/components/Icon";
import { AsgRecord } from "@/interfaces/services/QueryService/records";
import { TFlatMetadata } from "@/interfaces/services/QueryService/metadata";
import { GeoJSONProperties } from "@/interfaces/services/QueryService/properties";

import {
  isFireFlat,
  isQuilomboFlat,
  isDeterFlat,
  isProdesFlat,
  isIcmbioFlat,
  isFunaiFlat,
  isSicarFlat,
} from "@/interfaces/services/QueryService/type_guards";
import { formatArea, formatDate } from "@/utils/formatters";
import { MAP_SOURCES } from "@/constants/map";
import { SICAR_STATUS_MAP } from "@/helpers/mapDetails";

// URL base da API — avaliada em módulo (build-time pelo Next.js), funciona dentro de renderToString
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export type PopupPayload = AsgRecord | GeoJSONProperties | TFlatMetadata;

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => {
  const isInvalid = !value || value === "-999.0" || value === "N/I";

  return (
    <div className="flex justify-between items-center gap-8">
      <p className="uppercase font-semibold text-slate-400 whitespace-nowrap">{label}</p>
      <p
        className={`uppercase font-semibold text-right truncate ${isInvalid ? "text-slate-500" : "text-slate-700"
          }`}
      >
        {isInvalid ? "Não informado" : value}
      </p>
    </div>
  );
};

const isRecordObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const discoverSource = (p: PopupPayload, data: unknown): string => {
  const rawFonte = ("fonte" in p && typeof p.fonte === "string") ? p.fonte :
    (isRecordObject(data) && "fonte" in data && typeof data.fonte === "string") ? data.fonte :
      (isRecordObject(data) && "tipo" in data && typeof data.tipo === "string") ? data.tipo : null;

  if (rawFonte) {
    const f = rawFonte.toLowerCase();
    if (MAP_SOURCES[f]) return f;
    if (f === "queimada") return "queimadas";
    if (f === "desmatamento") return "deter";
  }

  if (isFireFlat(data)) return "queimadas";
  if (isDeterFlat(data)) return "deter";
  if (isProdesFlat(data)) return "prodes";
  if (isFunaiFlat(data)) return "funai";
  if (isIcmbioFlat(data)) return "icmbio";
  if (isQuilomboFlat(data)) return "palmares";
  if (isSicarFlat(data)) return "sicar";
  return "desconhecida";
};

export const PopupContent = ({ p }: { p: PopupPayload }) => {
  const isPObj = typeof p === "object" && p !== null;
  const data = isPObj && "tipo_registro" in p ? (p as AsgRecord).metadados_json : p;
  const isDataObj = typeof data === "object" && data !== null;

  const fonte = discoverSource(p, data);
  const config = MAP_SOURCES[fonte] ?? MAP_SOURCES.desconhecida;
  const bgColor = config.color;

  const municipio = isPObj && "municipio" in p && p.municipio ? String(p.municipio) : undefined;

  let dataReferencia =
    isPObj && "data_referencia" in p && p.data_referencia ? String(p.data_referencia) : undefined;

  if (!dataReferencia && isDataObj) {
    const rawData =
      ("data_hora" in data ? data.data_hora : null) ||
      ("data_avistamento" in data ? data.data_avistamento : null) ||
      ("data_imagem" in data ? data.data_imagem : null);

    if (rawData) {
      dataReferencia = String(rawData);
    }
  }

  let title = "Documento";
  let fields: React.ReactNode = null;

  switch (fonte) {
    case "queimadas": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = "Área detectada";

      // Monta URL do Sentinel-2:
      // Prioridade 1: por id (mais preciso)
      // Prioridade 2: por lat/lon/data como query params (fallback robusto)
      let imgUrl: string | null = null;
      if (d.id) {
        imgUrl = `${API_BASE}/dados/queimadas/${d.id}/imagem-satelite`;
      } else if (d.latitude && d.longitude) {
        const dataStr = (d.data_hora ?? d.data ?? "").slice(0, 10);
        const params = new URLSearchParams({
          lat: String(d.latitude),
          lon: String(d.longitude),
          ...(dataStr ? { data: dataStr } : {}),
        });
        imgUrl = `${API_BASE}/dados/queimadas/0/imagem-satelite?${params.toString()}`;
      }

      fields = (
        <>
          {imgUrl && (
            <div
              style={{
                margin: "-16px -16px 8px -16px",
                overflow: "hidden",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt="Imagem Sentinel-2 da queimada"
                loading="lazy"
                style={{
                  width: "100%",
                  maxHeight: 160,
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  textAlign: "right",
                  padding: "2px 6px",
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                Sentinel-2 · Planetary Computer
              </div>
            </div>
          )}
          <InfoRow label="Bioma" value={d.bioma} />
          <InfoRow label="FRP (Potência)" value={d.frp ? `${d.frp} MW` : null} />
          <InfoRow label="Risco Fogo" value={d.risco_fogo} />
          <InfoRow label="Satélite" value={d.satelite} />
        </>
      );
      break;
    }

    case "palmares": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = d.comunidade || "Comunidade Quilombola";
      fields = (
        <>
          <InfoRow label="Município" value={(municipio as string) || d.comunidade} />
          <InfoRow label="Certificação" value={d.ano_certificacao} />
          <InfoRow label="FCP" value={d.processo_fcp} />
          <InfoRow label="Incra" value={d.processo_incra} />
        </>
      );
      break;
    }

    case "deter": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = d.classe || "Alerta DETER";
      const area = "area_total_km2" in d ? d.area_total_km2 : d.area_km2;
      const satelite = "satelite" in d ? d.satelite : null;

      fields = (
        <>
          <InfoRow label="Classe" value={d.classe} />
          <InfoRow label="Área" value={formatArea(area, "km²")} />
          <InfoRow label="Satélite" value={satelite} />
        </>
      );
      break;
    }

    case "prodes": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      const classeNome = d.classe_nome || d.classe;
      title = classeNome || "Desmatamento PRODES";

      fields = (
        <>
          <InfoRow label="Ano" value={d.ano} />
          <InfoRow label="Classe" value={classeNome} />
          <InfoRow label="Área" value={formatArea(d.area_km || d.area_km2, "km²")} />
          <InfoRow label="Satélite" value={d.satelite} />
        </>
      );
      break;
    }

    case "icmbio": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = d.nome || "Unidade de Conservação";
      fields = (
        <>
          <InfoRow label="Categoria" value={d.categoria} />
          <InfoRow label="Grupo" value={d.grupo} />
          <InfoRow label="Esfera" value={d.esfera} />
          <InfoRow label="Área" value={formatArea(d.area_ha, "ha")} />
        </>
      );
      break;
    }

    case "funai": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = d.nome || "Terra Indígena";
      fields = (
        <>
          <InfoRow label="Município" value={municipio} />
          <InfoRow label="Etnia" value={d.etnia} />
          <InfoRow label="Fase" value={d.fase} />
          <InfoRow label="Área" value={formatArea(d.area_ha, "ha")} />
        </>
      );
      break;
    }

    case "sicar": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      title = d.cod_imovel || "Imóvel Rural (CAR)";

      const formattedStatus = d.ind_status
        ? SICAR_STATUS_MAP[String(d.ind_status).toUpperCase()] || d.ind_status
        : null;

      fields = (
        <>
          <InfoRow label="Município" value={municipio} />
          <InfoRow label="Categoria" value={d.ind_tipo} />
          <InfoRow label="Status" value={formattedStatus} />
          <InfoRow label="Condição" value={d.des_condic} />
          <InfoRow label="Área" value={formatArea(d.num_area, "ha")} />
          <InfoRow label="Mód. Fiscais" value={d.mod_fiscal} />
        </>
      );
      break;
    }
  }

  return (
    <div className="font-sans overflow-hidden bg-white shadow-xl min-w-70">
      <header
        className="text-white p-3 flex items-center gap-2 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        <Icon name={config.icon} size={32} className="fill-white text-white" />
        <div className="flex flex-col gap-1 ps-1">
          <span className="text-[12px] uppercase font-semibold leading-none opacity-80">
            {config.label}
          </span>
          <span className="uppercase text-sm font-bold truncate leading-tight">{title}</span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {fields}

        <footer className="pt-4 mt-4 border-t border-slate-100 text-slate-400 flex flex-col justify-between uppercase gap-2 font-semibold">
          <InfoRow label="Fonte" value={fonte} />
          {dataReferencia && <InfoRow label="Data" value={formatDate(dataReferencia)} />}
        </footer>
      </div>
    </div>
  );
};

export const INTENTION_TEMPLATES = new Proxy(
  {},
  {
    get: () => (p: PopupPayload) => renderToString(<PopupContent p={p} />),
  }
) as Record<string, (p: PopupPayload) => string>;
