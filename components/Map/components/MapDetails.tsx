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
} from "@/interfaces/services/QueryService/type_guards";
import { formatArea, formatDate } from "@/utils/formatters";
import { MAP_SOURCES } from "@/constants/map";

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
        className={`uppercase font-semibold text-right truncate ${
          isInvalid ? "text-slate-500" : "text-slate-700"
        }`}
      >
        {isInvalid ? "Não informado" : value}
      </p>
    </div>
  );
};

const discoverSource = (p: PopupPayload, data: unknown): string => {
  if ("fonte" in p && typeof p.fonte === "string") return p.fonte;
  if (isFireFlat(data)) return "queimadas";
  if (isDeterFlat(data)) return "deter";
  if (isProdesFlat(data)) return "prodes";
  if (isFunaiFlat(data)) return "funai";
  if (isIcmbioFlat(data)) return "icmbio";
  if (isQuilomboFlat(data)) return "palmares";
  return "desconhecido";
};

export const PopupContent = ({ p }: { p: PopupPayload }) => {
  const isPObj = typeof p === "object" && p !== null;
  const data = isPObj && "tipo_registro" in p ? (p as AsgRecord).metadados_json : p;
  const isDataObj = typeof data === "object" && data !== null;

  const fonte = discoverSource(p, data);
  const config = MAP_SOURCES[fonte];
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
    case "queimadas":
      if (isFireFlat(data)) {
        title = "Área detectada";
        fields = (
          <>
            <InfoRow label="Bioma" value={data.bioma} />
            <InfoRow label="FRP (Potência)" value={data.frp ? `${data.frp} MW` : null} />
            <InfoRow label="Risco Fogo" value={data.risco_fogo} />
            <InfoRow label="Satélite" value={data.satelite} />
          </>
        );
      }
      break;

    case "palmares":
      if (isQuilomboFlat(data)) {
        title = data.comunidade || "Comunidade Quilombola";
        fields = (
          <>
            <InfoRow label="Município" value={(municipio as string) || data.comunidade} />
            <InfoRow label="Certificação" value={data.ano_certificacao} />
            <InfoRow label="FCP" value={data.processo_fcp} />
            <InfoRow label="Incra" value={data.processo_incra} />
          </>
        );
      }
      break;

    case "deter":
      if (isDeterFlat(data)) {
        title = data.classe || "Alerta DETER";

        const area = "area_total_km2" in data ? data.area_total_km2 : data.area_km2;
        const satelite = "satelite" in data ? data.satelite : null;

        fields = (
          <>
            <InfoRow label="Classe" value={data.classe} />
            <InfoRow label="Área" value={formatArea(area, "km²")} />
            <InfoRow label="Satélite" value={satelite} />
          </>
        );
      }
      break;

    case "prodes":
      if (isProdesFlat(data)) {
        const classeNome = "classe_nome" in data ? data.classe_nome : data.classe;
        title = classeNome || "Desmatamento PRODES";

        fields = (
          <>
            <InfoRow label="Ano" value={data.ano} />
            <InfoRow label="Classe" value={classeNome} />
            <InfoRow label="Área" value={formatArea(data.area_km, "km²")} />
            <InfoRow label="Satélite" value={data.satelite} />
          </>
        );
      }
      break;

    case "icmbio":
      if (isIcmbioFlat(data)) {
        title = data.nome || "Unidade de Conservação";
        fields = (
          <>
            <InfoRow label="Categoria" value={data.categoria} />
            <InfoRow label="Grupo" value={data.grupo} />
            <InfoRow label="Esfera" value={data.esfera} />
            <InfoRow label="Área" value={formatArea(data.area_ha, "ha")} />
          </>
        );
      }
      break;

    case "funai":
      if (isFunaiFlat(data)) {
        title = data.nome || "Terra Indígena";
        fields = (
          <>
            <InfoRow label="Município" value={municipio} />
            <InfoRow label="Etnia" value={data.etnia} />
            <InfoRow label="Fase" value={data.fase} />
            <InfoRow label="Área" value={formatArea(data.area_ha, "ha")} />
          </>
        );
      }
      break;
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
