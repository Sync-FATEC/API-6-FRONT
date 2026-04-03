import { IPipelineHistoryResponse } from "@/interfaces/services/PipelineService";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";

interface Props {
  isLoading: boolean;
  data: IPipelineHistoryResponse | undefined;
}

export default function HistoryBody({ isLoading, data }: Props) {
  return (
    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-5 scrollbar-mini">
      {isLoading ? (
        <p className=" text-slate-500 py-4">Carregando histórico...</p>
      ) : !data || data.execucoes.length === 0 ? (
        <p className=" text-slate-500">Nenhum histórico foi encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {data.execucoes.map((execution, index) => {
            const startDate = formatDate(execution.inicio);

            return (
              <li key={index} className="rounded-lg p-3 text-sm flex flex-col gap-2 bg-slate-50">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-700">{execution.pipeline}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-sm text-xs",
                      execution.sucesso ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
                    )}
                  >
                    {execution.sucesso ? "Sucesso" : "Falha"}
                  </span>
                </div>

                <div className="text-slate-500 text-xs flex justify-between border-b border-slate-200 pb-2 mb-1">
                  <span>Início: {startDate}</span>
                  <span>Duração: {execution.duracao_total_segundos.toFixed(1)}s</span>
                </div>

                {execution.etapas.length > 0 && (
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Etapas: </span>
                    {execution.etapas.map((stage) => stage.etapa).join(" -> ")}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
