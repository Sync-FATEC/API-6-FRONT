import { DIMENSION_LABEL, RISK_CONFIG } from "@/constants/chat";
import { INotaRisco } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import { AHPMethodSection } from "./Method";

interface RiskScoreSectionProps {
  risk: INotaRisco;
}

export function RiskScoreSection({ risk }: RiskScoreSectionProps) {
  const config = RISK_CONFIG[risk.nivel] ?? RISK_CONFIG.sem_dados;
  const percentage = Math.min(risk.nota, 100);

  return (
    <section className="flex flex-col gap-4 pt-8 border-t border-slate-200">
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        Risco Socioambiental
      </h4>

      <div className="grid grid-cols-[1fr_140px] gap-4 items-stretch">
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-4">
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-500 font-medium">Nota geral</span>
              <span className={cn("text-xs font-semibold", config.color)}>{config.label}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", config.bar)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {Object.keys(risk.por_dimensao).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.entries(risk.por_dimensao).map(([dimension, points]) => {
                const weightPercentage = risk.metodo_ahp?.pesos_percentual?.[dimension];
                const maxPoints = weightPercentage ?? 40;
                const dimensionPercentage = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
                
                return (
                  <div key={dimension} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 w-36 shrink-0 flex items-center gap-1">
                      {DIMENSION_LABEL[dimension] ?? dimension}
                      {weightPercentage != null && (
                        <span className="text-[10px] text-slate-400">({weightPercentage}%)</span>
                      )}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", config.bar)}
                        style={{ width: `${Math.min(dimensionPercentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-mono w-14 text-right">
                      {points}/{maxPoints.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fatores */}
          {risk.fatores.length > 0 && (
            <div className="flex flex-col gap-1 pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium mb-1">Fatores identificados</span>
              {risk.fatores.map((factor, index) => (
                <div key={index} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <span className={cn("text-5xl font-bold tabular-nums", config.color)}>{risk.nota}</span>
          <span className="text-xs text-slate-400 font-medium">de 100</span>
        </div>
      </div>

      {risk.metodo_ahp && <AHPMethodSection ahp={risk.metodo_ahp} />}
    </section>
  );
}