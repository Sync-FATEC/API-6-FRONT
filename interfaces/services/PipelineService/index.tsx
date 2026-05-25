export interface IPipelineExecutionResponse {
  status: "iniciado" | "erro";
  etapa?: string;
  detalhe?: string;
  skip_sicar?: boolean;
  execution_id?: string;
}

export interface IPipelineStep {
  etapa: string;
  status: string;
  registros: number;
  duracao_segundos: number;
  timestamp: string;
}

export interface IPipelineError {
  etapa: string;
  erro: string;
  timestamp: string;
}

export interface IPipelineRetryAttempt {
  tentativa: number;
  status: string;
  erro?: string;
  duracao_segundos?: number;
  timestamp?: string;
}

export interface IPipelineSourceStatus {
  fonte: string;
  status: string;
  registros?: number;
  duracao_segundos?: number;
  tentativa_atual?: number;
  tentativas?: number;
  max_tentativas?: number;
  mensagem?: string;
  mensagem_final?: string;
  erro?: string;
  atualizado_em?: string;
  historico_tentativas?: IPipelineRetryAttempt[];
}

export interface IPipelineStatusEvent {
  timestamp: string;
  tipo: string;
  mensagem: string;
  etapa?: string;
  fonte?: string;
  tentativa?: number;
  max_tentativas?: number;
  erro?: string;
  aguardar_segundos?: number;
}

export interface IPipelineStatusResponse {
  execution_id: string;
  pipeline: string;
  inicio: string;
  fim?: string;
  atualizado_em?: string;
  etapa_atual?: string;
  etapa_solicitada?: string;
  status_execucao: "em_andamento" | "sucesso" | "falha" | string;
  finalizado: boolean;
  mensagem?: string;
  skip_sicar?: boolean;
  duracao_total_segundos?: number;
  etapas: IPipelineStep[];
  erros: IPipelineError[];
  fontes: IPipelineSourceStatus[];
  eventos: IPipelineStatusEvent[];
}

export interface IPipelineExecution {
  execution_id?: string;
  pipeline: string;
  inicio: string;
  fim: string;
  duracao_total: number;
  duracao_total_segundos?: number;
  etapas: IPipelineStep[];
  erros: IPipelineError[];
  fontes?: IPipelineSourceStatus[];
  eventos?: IPipelineStatusEvent[];
  status_arquivo?: string;
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
