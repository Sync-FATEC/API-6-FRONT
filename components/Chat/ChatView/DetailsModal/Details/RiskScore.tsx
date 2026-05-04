import { DIMENSION_LABEL, RISK_CONFIG } from "@/constants/chat";
import { INotaRisco } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";

interface RiskScoreSectionProps {
  risk: INotaRisco;
}

export function RiskScoreSection({ risk }: RiskScoreSectionProps) {
  const config = RISK_CONFIG[risk.nivel] ?? RISK_CONFIG.sem_dados;
  const percentage = Math.min(risk.nota, 100);

  return (
    <section className="flex flex-col gap-3 pt-8 border-t border-slate-200">
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        Risco Socioambiental
      </h4>

      <div className="grid grid-cols-[1fr_140px] gap-3 items-stretch">
        <div className="flex flex-col gap-3">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500 font-medium">Nota final</span>
              <span className={cn("text-sm font-semibold", config.color)}>Risco {config.label}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", config.bar)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {Object.keys(risk.por_dimensao).length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2">
              {Object.entries(risk.por_dimensao).map(([dimension, points]) => {
                const weightPercentage = risk.metodo_ahp?.pesos_percentual?.[dimension];
                const maxPoints = weightPercentage ?? 40;
                const dimensionPercentage =
                  maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;

                let barColorClass = "bg-asg-terrible";
                if (dimensionPercentage <= 20) barColorClass = "bg-asg-great";
                else if (dimensionPercentage <= 40) barColorClass = "bg-asg-good";
                else if (dimensionPercentage <= 60) barColorClass = "bg-asg-okay";
                else if (dimensionPercentage <= 80) barColorClass = "bg-asg-bad";

                return (
                  <div key={dimension} className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 w-3/10 shrink-0 flex items-center gap-1">
                      {DIMENSION_LABEL[dimension] ?? dimension}
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", barColorClass)}
                        style={{ width: `${Math.min(dimensionPercentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-mono w-18 text-right">
                      {points}/{maxPoints.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {risk.fatores.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-sm text-slate-500 font-medium mb-1">Fatores identificados</span>
              {risk.fatores.map((factor, index) => (
                <div key={index} className="flex items-start gap-1.5 text-sm text-slate-600">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <span className={cn("text-5xl font-bold tabular-nums", config.color)}>{risk.nota}</span>
          <span className="text-sm text-slate-400 font-medium">de 100</span>
        </div>
      </div>
    </section>
  );
}
