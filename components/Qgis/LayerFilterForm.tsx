"use client";

import {
  IQgisLayer,
  IQgisFilterLimit,
  QgisFilterKey,
  QgisFilterValues,
} from "@/interfaces/services/QgisService";
import DateTimePicker from "@/components/Inputs/DateTimePicker";
import { formatToYYYYMMDD } from "@/helpers/dashboard";

interface Props {
  camada: IQgisLayer;
  valores: QgisFilterValues;
  onChange: (valores: QgisFilterValues) => void;
  onReset: () => void;
}

const LABELS: Record<QgisFilterKey, string> = {
  municipio: "Município",
  data_inicio: "Data inicial",
  data_fim: "Data final",
  bbox: "Bounding box",
  limite: "Limite",
  offset: "Offset",
  ano: "Ano",
  cod_imovel: "Código CAR",
  ind_status: "Status",
  classe: "Classe",
  simplify: "Simplificação",
};

const TIPOS: Record<QgisFilterKey, "text" | "date" | "number"> = {
  municipio: "text",
  data_inicio: "date",
  data_fim: "date",
  bbox: "text",
  limite: "number",
  offset: "number",
  ano: "number",
  cod_imovel: "text",
  ind_status: "text",
  classe: "text",
  simplify: "number",
};

const PLACEHOLDERS: Partial<Record<QgisFilterKey, string>> = {
  municipio: "Ex: Ubatuba",
  bbox: "-48.0,-23.5,-47.5,-23.0",
  cod_imovel: "SP-3555406-...",
  ind_status: "AT",
  simplify: "0.0001",
};

const FILTROS_SIMPLES: QgisFilterKey[] = [
  "municipio",
  "data_inicio",
  "data_fim",
  "ano",
  "limite",
  "cod_imovel",
];

const hintFromLimite = (lim?: IQgisFilterLimit): string => {
  if (!lim) return "";
  if (lim.formato) return lim.formato;
  const partes: string[] = [];
  if (lim.min !== undefined) partes.push(`mín ${lim.min}`);
  if (lim.max !== undefined) partes.push(`máx ${lim.max}`);
  return partes.join(" · ");
};

export default function LayerFilterForm({ camada, valores, onChange, onReset }: Props) {
  const handle = (key: QgisFilterKey, raw: string) => {
    const lim = camada.limites?.[key];
    let value: string | number | undefined = raw || undefined;
    if (value !== undefined && TIPOS[key] === "number" && lim) {
      const n = Number(value);
      if (!Number.isNaN(n)) {
        let clamped = n;
        if (lim.min !== undefined) clamped = Math.max(lim.min, clamped);
        if (lim.max !== undefined) clamped = Math.min(lim.max, clamped);
        value = clamped;
      }
    }
    onChange({ ...valores, [key]: value });
  };

  const visiveis = camada.filtros.filter((k) => FILTROS_SIMPLES.includes(k));
  if (visiveis.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider px-0.5">
          Filtros
        </h3>
        <button
          onClick={onReset}
          type="button"
          className="text-xs font-medium text-slate-400 hover:text-primary cursor-pointer"
        >
          Limpar
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {visiveis.map((key) => {
          const lim = camada.limites?.[key];
          const hint = hintFromLimite(lim);
          if (key === "data_inicio" || key === "data_fim") {
            return (
              <DateTimePicker
                key={key}
                label={LABELS[key]}
                id={key}
                includeTime={false}
                value={
                  valores[key]
                    ? new Date(`${valores[key]}T00:00:00`)
                    : undefined
                }
                onChange={(date: Date) => handle(key, formatToYYYYMMDD(date))}
                wrapperClassName="w-full"
                className="w-full"
              />
            );
          }
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  {LABELS[key]}
                </label>
                {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
              </div>
              <input
                type={TIPOS[key]}
                value={(valores[key] ?? "") as string | number}
                placeholder={PLACEHOLDERS[key] ?? lim?.formato}
                onChange={(e) => handle(key, e.target.value)}
                min={lim?.min}
                max={lim?.max}
                step={key === "simplify" ? "0.0001" : undefined}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
