export interface IDashboardStats {
  queimadas: number;
  terras_indigenas: number;
  desmatamento_alertas: number;
  unidades_conservacao: number;
  prodes_desmatamento: number;
  comunidades_quilombolas: number;
  corpus_asg: number;
  [key: string]: number;
}

export interface IQueimadasData {
  data: string;
  quantidade: number;
}

export interface IDesmatamentoData {
  data: string;
  area_total_km2: number;
}

export interface IDashboardResponse {
  stats: IDashboardStats;
  queimadas_por_periodo?: IQueimadasData[];
  desmatamento_por_periodo?: IDesmatamentoData[];
  timestamp_atualizacao: string;
}
