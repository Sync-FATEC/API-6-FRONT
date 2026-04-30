import { formatIntent, RISK_CONFIG } from "@/constants/chat";
import { IGrupoResposta, RiscoNivel } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";

interface GroupDetailCardProps {
  group: IGrupoResposta;
}

export function GroupDetailCard({ group }: GroupDetailCardProps) {
  const riskLevel = (group.nota_risco?.nivel ?? "sem_dados") as RiscoNivel;
  const config = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.sem_dados;
  const score = group.nota_risco?.nota ?? 0;
  
  const formattedSources =
    group.fontes && group.fontes.length > 0
      ? group.fontes.map((source) => source.nome || source.identificador).join(" | ")
      : "—";

  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-700">{group.rotulo || "—"}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {formatIntent(group.filtros?.intencao)}
            {group.filtros?.municipio && ` · ${group.filtros.municipio}`}
            {group.filtros?.cod_imovel && ` · ${group.filtros.cod_imovel}`}
          </div>
        </div>
        
        {group.nota_risco && riskLevel !== "sem_dados" ? (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
              config.badge
            )}
          >
            {config.label} · {score}/100
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-500">
            sem dados
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-slate-400">Registros</div>
          <div className="text-slate-700 font-semibold tabular-nums">
            {group.total_resultados}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Fontes</div>
          <div className="text-slate-700 leading-snug">{formattedSources}</div>
        </div>
      </div>

      {group.resumo && (
        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2">
          {group.resumo}
        </p>
      )}

      {group.nota_risco?.fatores && group.nota_risco.fatores.length > 0 && (
        <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5 border-t border-slate-200 pt-2">
          {group.nota_risco.fatores.slice(0, 4).map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      )}
    </div>
  );
}