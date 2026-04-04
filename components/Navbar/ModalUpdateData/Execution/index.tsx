import { IPipelineExecutionResponse } from "@/interfaces/services/PipelineService";

interface Props {
  isLoading: boolean;
  error: string | null;
  data: IPipelineExecutionResponse | undefined;
}

export default function ExecutionBody({ error, data }: Props) {
  return (
    <div className="text-slate-600 space-y-4">
      <p>
        Clique no botão <span className="text-slate-700 font-semibold">Executar Pipeline</span> para
        iniciar um processo de Pipeline ETL no servidor.
      </p>

      {data?.status === "iniciado" && (
        <div className="p-4 bg-success/5 rounded-md text-green-700">
          <strong>Pipeline iniciado com sucesso!</strong>
        </div>
      )}

      {(error || data?.status === "erro") && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <strong>Falha ao iniciar o pipeline:</strong>
          <br />
          {error || data?.detalhe}
        </div>
      )}
    </div>
  );
}
