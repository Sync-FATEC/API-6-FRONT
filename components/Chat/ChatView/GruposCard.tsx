import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";
import {
  EixoAgrupamento,
  IGrupoResposta,
  RiscoNivel,
} from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";

interface Props {
  grupos: IGrupoResposta[];
  eixo: EixoAgrupamento;
}

const NIVEL_CONFIG: Record<
  RiscoNivel,
  { label: string; dot: string; bg: string; text: string }
> = {
  sem_dados: {
    label: "sem dados",
    dot: "bg-slate-300",
    bg: "bg-slate-50",
    text: "text-slate-500",
  },
  baixo: {
    label: "baixo",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  moderado: {
    label: "moderado",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  elevado: {
    label: "elevado",
    dot: "bg-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  alto: {
    label: "alto",
    dot: "bg-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  critico: {
    label: "crítico",
    dot: "bg-rose-600",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
};

const EIXO_LABEL: Record<EixoAgrupamento, { titulo: string; icon: IconName }> = {
  unico: { titulo: "Resultado", icon: "search" },
  municipio: { titulo: "Comparativo por município", icon: "gps-pin" },
  intencao: { titulo: "Comparativo por tema", icon: "data" },
  composto: { titulo: "Comparativo por município e tema", icon: "bar-chart-2" },
};

export default function GruposCard({ grupos, eixo }: Props) {
  if (!grupos || grupos.length === 0) return null;

  const header = EIXO_LABEL[eixo] ?? EIXO_LABEL.unico;

  return (
    <div
      className="mt-3 rounded-xl border border-slate-200 bg-white overflow-hidden animate-pop-in-up w-full"
      style={{ wordBreak: "normal", overflowWrap: "anywhere" }}
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
          <Icon name={header.icon} size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {header.titulo}
          </div>
          <div className="text-xs text-slate-600">
            {grupos.length} grupo{grupos.length > 1 ? "s" : ""}
          </div>
        </div>
      </header>

      <div className="p-3 flex flex-col gap-2">
        {grupos.map((g, idx) => {
          const nivel = (g.nota_risco?.nivel ?? "sem_dados") as RiscoNivel;
          const cfg = NIVEL_CONFIG[nivel] ?? NIVEL_CONFIG.sem_dados;
          const nota = g.nota_risco?.nota ?? 0;
          const sem = g.total_resultados === 0;

          return (
            <div
              key={`${g.rotulo}-${idx}`}
              className={cn(
                "rounded-lg border border-slate-200 p-3 flex flex-col gap-1.5 w-full",
                sem && "opacity-70",
              )}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span
                    className="text-sm font-semibold text-slate-800"
                    title={g.rotulo}
                  >
                    {g.rotulo || "—"}
                  </span>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {g.total_resultados} registro{g.total_resultados === 1 ? "" : "s"}
                  </span>
                </div>
                <div
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0",
                    cfg.bg,
                    cfg.text,
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}
                  {nota > 0 && <span className="tabular-nums opacity-70">· {nota}</span>}
                </div>
              </div>

              {g.resumo && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.resumo}
                </p>
              )}

              {g.nota_risco?.fatores && g.nota_risco.fatores.length > 0 && (
                <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5">
                  {g.nota_risco.fatores.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
