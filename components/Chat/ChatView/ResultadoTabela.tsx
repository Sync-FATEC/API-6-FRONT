"use client";

import { useState } from "react";
import { cn } from "@/utils/className";
import { formatNumber } from "@/utils/formatters";

type Row = Record<string, unknown>;

interface Props {
  dados: Row[];
  colunas?: string[];
}

const OCULTAR = new Set(["geometry", "geom", "geom_geojson", "geojson", "id"]);
const VISIVEIS_PADRAO = 5;

const COLUNA_LABEL: Record<string, string> = {
  municipio: "Município",
  cod_imovel: "Imóvel (CAR)",
  nome: "Nome",
  comunidade: "Comunidade",
  etnia: "Etnia",
  categoria: "Categoria",
  grupo: "Grupo",
  esfera: "Esfera",
  classe: "Classe",
  classe_nome: "Classe",
  estado: "Estado",
  bioma: "Bioma",
  ano: "Ano",
  mes: "Mês",
  ind_status: "Status",
  nivel_risco: "Nível",
  focos: "Focos",
  qtd_focos: "Focos",
  focos_total: "Focos",
  focos_recentes_12m: "Focos (12m)",
  alertas: "Alertas",
  qtd_alertas: "Alertas",
  alertas_deter_recentes_12m: "Alertas (12m)",
  total_eventos: "Eventos",
  area_km2: "Área (km²)",
  area_total_km2: "Área (km²)",
  area_km: "Área (km²)",
  num_area: "Área (ha)",
  area_ha: "Área (ha)",
  area_impactada_pct: "Área impactada (%)",
  nota_risco: "Risco",
  n_fatores_risco: "Fatores",
  mod_fiscal: "Mód. fiscais",
  frp_medio: "FRP médio",
  dist_ti_km: "Dist. TI (km)",
  crescimento_pct: "Crescimento (%)",
  crescimento_abs: "Crescimento",
  percentual: "%",
};

function rotuloColuna(k: string): string {
  return (
    COLUNA_LABEL[k] ??
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function ehNumero(v: unknown): v is number {
  return typeof v === "number" && !Number.isNaN(v);
}

function formatar(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (ehNumero(v)) return formatNumber(v);
  return String(v);
}

export default function ResultadoTabela({ dados, colunas }: Props) {
  const [expandido, setExpandido] = useState(false);

  if (!dados || dados.length === 0) return null;

  const cols = (colunas && colunas.length ? colunas : Object.keys(dados[0]))
    .filter((c) => !OCULTAR.has(c.toLowerCase()))
    .slice(0, 6);
  if (cols.length === 0) return null;

  const visiveis = expandido ? dados.slice(0, 50) : dados.slice(0, VISIVEIS_PADRAO);
  const restante = dados.length - visiveis.length;

  // Ranking visual quando há 1 dimensão (texto) + 1 métrica (número).
  const colNum = cols.find((c) => ehNumero(dados[0]?.[c]));
  const colTexto = cols.find((c) => !ehNumero(dados[0]?.[c]));
  const ehRanking = cols.length === 2 && !!colNum && !!colTexto;

  const maxValor = ehRanking
    ? Math.max(...dados.map((r) => Math.abs(Number(r[colNum!]) || 0)), 1)
    : 1;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white overflow-hidden animate-pop-in-up w-full">
      <header className="flex items-center justify-between px-3 py-2 bg-slate-50/70 border-b border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Resultados
        </span>
        <span className="text-[11px] font-medium text-slate-400 tabular-nums">
          {dados.length} {dados.length === 1 ? "registro" : "registros"}
        </span>
      </header>

      {ehRanking ? (
        <ul className="p-2 flex flex-col gap-1">
          {visiveis.map((r, i) => {
            const valor = Number(r[colNum!]) || 0;
            const pct = Math.max(2, (Math.abs(valor) / maxValor) * 100);
            return (
              <li key={i} className="flex items-center gap-2 px-1.5 py-1 rounded-md">
                <span className="w-4 shrink-0 text-[11px] font-semibold text-slate-400 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-slate-700 truncate" title={String(r[colTexto!])}>
                      {formatar(r[colTexto!])}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 tabular-nums shrink-0">
                      {formatar(valor)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={cn("overflow-x-auto", expandido && "max-h-72 overflow-y-auto")}>
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm">
              <tr>
                {cols.map((c) => (
                  <th
                    key={c}
                    className={cn(
                      "px-3 py-1.5 font-semibold text-slate-500 whitespace-nowrap",
                      ehNumero(dados[0]?.[c]) ? "text-right" : "text-left"
                    )}
                  >
                    {rotuloColuna(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {cols.map((c) => (
                    <td
                      key={c}
                      className={cn(
                        "px-3 py-1.5 text-slate-700 whitespace-nowrap",
                        ehNumero(r[c]) ? "text-right tabular-nums" : "text-left",
                        c === cols[0] && "font-medium"
                      )}
                      title={String(r[c] ?? "")}
                    >
                      {formatar(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(restante > 0 || expandido) && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="w-full text-[11px] font-semibold text-primary hover:bg-slate-50 py-2 border-t border-slate-100 transition-colors"
        >
          {expandido ? "Ver menos" : `Ver mais (${restante})`}
        </button>
      )}
    </div>
  );
}
