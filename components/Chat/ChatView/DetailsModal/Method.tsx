import { useState } from "react";
import { IAhpInfo } from "@/interfaces/services/QueryService";
import { cn } from "@/utils/className";
import { DIMENSION_LABEL } from "@/constants/chat";

interface AHPMethodSectionProps {
  ahp: IAhpInfo;
}

export function AHPMethodSection({ ahp }: AHPMethodSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const consistencyRatio = ahp.consistencia.cr;
  const isConsistent = ahp.consistencia.consistente;

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Como foi calculado
          </span>
          <span className="text-xs text-slate-700 font-semibold">{ahp.metodo}</span>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              isConsistent ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}
            title={`Razão de Consistência: ${consistencyRatio} (exige CR < 0.10)`}
          >
            {isConsistent ? `CR ${consistencyRatio} ✓` : `CR ${consistencyRatio} ✗`}
          </span>
        </div>
        <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed pt-3">
            O <strong>{ahp.metodo}</strong> deriva os pesos dos critérios a partir de uma matriz de
            comparação par a par na <strong>{ahp.escala}</strong>. Os pesos são calculados via
            autovetor principal e validados pela Razão de Consistência (CR &lt; 0.10).
          </p>

          <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-2">
            <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pesos derivados do AHP
            </h6>
            {Object.entries(ahp.pesos_percentual)
              .sort((a, b) => b[1] - a[1])
              .map(([dimension, percentage]) => (
                <div key={dimension} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 w-40 shrink-0">
                    {DIMENSION_LABEL[dimension] ?? dimension}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-700 font-mono w-12 text-right font-semibold">
                    {percentage}%
                  </span>
                </div>
              ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1.5">
            <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Consistência da matriz
            </h6>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400">λmax</span>
                <div className="font-mono text-slate-700">{ahp.consistencia.lambda_max}</div>
              </div>
              <div>
                <span className="text-slate-400">CI</span>
                <div className="font-mono text-slate-700">{ahp.consistencia.ci}</div>
              </div>
              <div>
                <span className="text-slate-400">CR</span>
                <div
                  className={cn(
                    "font-mono font-semibold",
                    isConsistent ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {ahp.consistencia.cr}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic leading-relaxed">{ahp.justificativa}</p>
        </div>
      )}
    </div>
  );
}