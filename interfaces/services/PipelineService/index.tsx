export interface IPipelineExecutionResponse {
  status: "iniciado" | "erro";
  etapa?: string;
  detalhe?: string;
}

export interface IPipelineStep {
  etapa: string;
  status: string;
  registros: number;
  duracao_segundos: number;
  timestamp: string;
}

export interface IPipelineExecution {
  pipeline: string;
  inicio: string;
  fim: string;
  duracao_total_segundos: number;
  etapas: IPipelineStep[];
  erros: string[];
  sucesso: boolean;
}

export interface IPipelineHistoryResponse {
  execucoes: IPipelineExecution[];
  total: number;
}
