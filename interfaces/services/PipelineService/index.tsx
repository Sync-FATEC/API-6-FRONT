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
  duracao_total: number;
  etapas: IPipelineStep[];
  erros: string[];
  sucesso: boolean;
}

export interface IPipelineHistoryResponse {
  execucoes: IPipelineExecution[];
  total: number;
}

export interface PipelineSourceStatus {
  contagem: number;
  ultima_atualizacao: string;
}

export interface PipelineStatusResponse {
  rodando: boolean;
  inicio_execucao?: string;
  etapa_atual?: string;
  entidades_atuais?: string[];
  fontes: {
    "inpe/queimadas": PipelineSourceStatus;
    funai: PipelineSourceStatus;
    "inpe/deter": PipelineSourceStatus;
    "inpe/prodes": PipelineSourceStatus;
    "mma/icmbio": PipelineSourceStatus;
    fundação_cultural_palmares: PipelineSourceStatus;
    "sicar_-_sp_area_imovel": PipelineSourceStatus;
  };
}

export interface PipelineCancelResponse {
  status: string;
  mensagem: string;
}
