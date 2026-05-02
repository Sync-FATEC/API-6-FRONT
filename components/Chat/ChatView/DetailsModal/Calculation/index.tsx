import { IAhpInfo } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import { DIMENSION_LABEL } from "@/constants/chat";
import TooltipLabel from "@/components/Tooltip/TooltipLabel";

interface CalculationBodyProps {
  ahp: IAhpInfo;
}

export function CalculationBody({ ahp }: CalculationBodyProps) {
  const isConsistent = ahp.consistencia.consistente;

  return (
    <div className="flex flex-col gap-3 py-2">
      <p className="text-base text-slate-600 leading-relaxed -mt-2">
        O <strong>{ahp.metodo}</strong> deriva os pesos dos critérios a partir de uma matriz de
        comparação par a par na <strong>{ahp.escala}</strong>. Os pesos são calculados via autovetor
        principal e validados pela Razão de Consistência (CR &lt; 0.10). Veja abaixo os pesos:
      </p>

      <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
        <h6 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Pesos derivados do AHP
        </h6>
        {Object.entries(ahp.pesos_percentual)
          .sort((a, b) => b[1] - a[1])
          .map(([dimension, percentage]) => (
            <div key={dimension} className="flex items-center gap-3 text-sm">
              <span className="text-slate-600 w-42 shrink-0">
                {DIMENSION_LABEL[dimension] ?? dimension}
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-slate-600 font-mono w-14 text-right ">{percentage}%</span>
            </div>
          ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2">
        <h6 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Consistência da matriz
        </h6>
        <div className="grid grid-cols-3 gap-2 text-sm mt-1">
          <div>
            <TooltipLabel
              label="λ max"
              tip="Maior autovalor da matriz (Lambda Max). Usado como base matemática para calcular se os julgamentos foram coerentes."
              className="text-slate-500 mb-1"
            />
            <div className="font-mono text-lg text-slate-700">{ahp.consistencia.lambda_max}</div>
          </div>
          <div>
            <TooltipLabel
              label="CI"
              tip="Índice de Consistência (Consistency Index). Mede o grau bruto de divergência nas comparações feitas."
              className="text-slate-500 mb-1"
            />
            <div className="font-mono text-lg text-slate-700">{ahp.consistencia.ci}</div>
          </div>
          <div>
            <TooltipLabel
              label="CR"
              tip="Razão de Consistência (Consistency Ratio). Indica se os pesos são confiáveis. Valores abaixo de 0.10 garantem que não houve contradições matemáticas."
              className="text-slate-500 mb-1"
            />
            <div
              className={cn(
                "font-mono text-lg font-semibold",
                isConsistent ? "text-emerald-600" : "text-red-600"
              )}
            >
              {ahp.consistencia.cr}
            </div>
          </div>
        </div>
      </div>

      {ahp.justificativa && (
        <p className="text-[13px] text-slate-500 italic leading-relaxed">{ahp.justificativa}</p>
      )}
    </div>
  );
}
