/* eslint-disable @typescript-eslint/no-explicit-any */
import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";
import { COLORS } from "@/constants/map";
import React from "react";
import { renderToString } from "react-dom/server";

interface PopupProps {
  p: any;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => (
  <div className="flex justify-between items-center gap-8">
    <p className="uppercase font-semibold text-slate-400 whitespace-nowrap">{label}</p>
    <p className="uppercase font-semibold text-slate-700 text-right truncate">
      {value === "-999.0" || !value ? "N/I" : value}
    </p>
  </div>
);

const SOURCE_CONFIG: Record<string, { icon: IconName; label: string }> = {
  palmares: { icon: "fist", label: "Quilombo" },
  funai: { icon: "leaf", label: "Terra Indígena" },
  deter: { icon: "fist", label: "Alerta de Desmatamento" },
  icmbio: { icon: "fist", label: "Unidade de Conservação" },
  queimadas: { icon: "fist", label: "Queimada" },
  prodes: { icon: "fist", label: "Desmatamento Anual" },
};

const BasePopup = ({ p, children }: { p: any; children: React.ReactNode }) => {
  const config = SOURCE_CONFIG[p.fonte];
  const colorData = COLORS[p.fonte] || { cor: "#334155" };

  return (
    <div className="font-sans overflow-hidden bg-white shadow-xl">
      <header
        className="text-white p-3 flex items-center gap-2 shadow-sm"
        style={{ backgroundColor: colorData.color }}
      >
        <Icon name={config.icon} size={32} className="fill-white text-white" />
        <div className="flex flex-col gap-1 ps-1">
          <span className="text-[12px] uppercase font-semibold leading-none opacity-80">
            {config.label}
          </span>
          <span className="uppercase text-sm font-bold truncate leading-tight">
            {p.comunidade || p.nome || p.classe || p.terrai_nome}
          </span>
        </div>
      </header>
      <div className="p-4 space-y-3">
        {children}
        <footer className="pt-4 mt-4 border-t border-slate-100 text-slate-400 flex flex-col justify-between uppercase font-semibold">
          <InfoRow label="Fonte" value={p.fonte} />
          {p.data_referencia && <InfoRow label="Data" value={p.data_referencia} />}
        </footer>
      </div>
    </div>
  );
};

export const PopupContent = ({ p }: PopupProps) => {
  const data = p.metadados_json || p;

  // QUEIMADAS
  if (p.fonte === "queimadas") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Satélite" value={data.satelite} />
        <InfoRow label="Bioma" value={data.bioma} />
        <InfoRow label="FRP (Potência)" value={`${data.frp} MW`} />
        <InfoRow label="Risco Fogo" value={data.risco_fogo} />
      </BasePopup>
    );
  }

  // QUILOMBOLAS
  if (p.fonte === "palmares") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Município" value={p.municipio} />
        <InfoRow label="Certificação" value={data.ano_certificacao} />
        <InfoRow label="FCP" value={data.processo_fcp} />
        <InfoRow label="Incra" value={data.processo_incra} />
      </BasePopup>
    );
  }

  // DESMATAMENTO (DETER)
  if (p.fonte === "deter") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Classe" value={data.classe} />
        <InfoRow label="Área" value={`${data.area_km2} km²`} />
        <InfoRow label="Satélite" value={data.satelite} />
      </BasePopup>
    );
  }

  // DESMATAMENTO (PRODES)
  if (p.fonte === "prodes") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Ano" value={data.ano} />
        <InfoRow label="Classe" value={data.classe} />
        <InfoRow label="Área" value={`${Number(data.area_km).toFixed(4)} km²`} />
        <InfoRow label="Sensor" value={data.sensor} />
      </BasePopup>
    );
  }

  // UNIDADES DE CONSERVAÇÃO
  if (p.fonte === "icmbio") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Categoria" value={data.categoria} />
        <InfoRow label="Grupo" value={data.grupo} />
        <InfoRow label="Esfera" value={data.esfera} />
        <InfoRow label="Área" value={`${data.area_ha} ha`} />
      </BasePopup>
    );
  }

  // TERRAS INDÍGENAS
  if (p.fonte === "funai") {
    return (
      <BasePopup p={p}>
        <InfoRow label="Etnia" value={data.etnia} />
        <InfoRow label="Fase" value={data.fase} />
        <InfoRow label="Área" value={`${data.area_ha} ha`} />
      </BasePopup>
    );
  }

  return (
    <BasePopup p={p}>
      <p className="italic leading-snug p-2 bg-slate-50 rounded text-slate-500 text-[11px]">
        {p.texto}
      </p>
    </BasePopup>
  );
};

export const INTENTION_TEMPLATES: Record<string, (props: any) => string> = {
  consultar_quilombola: (p) => renderToString(<PopupContent p={p} />),
  consultar_terra_indigena: (p) => renderToString(<PopupContent p={p} />),
  consultar_desmatamento: (p) => renderToString(<PopupContent p={p} />),
  consultar_unidade_conservacao: (p) => renderToString(<PopupContent p={p} />),
  consultar_queimadas: (p) => renderToString(<PopupContent p={p} />),
  default: (p) => renderToString(<PopupContent p={p} />),
};
