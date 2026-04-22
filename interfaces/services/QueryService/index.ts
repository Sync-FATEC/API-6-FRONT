import { AsgRecord } from "./records";
import { IAsgFeatureCollection } from "./asg_geojson";
import { TFlatMetadata } from "./metadata";

export interface IEntities {
  municipios?: string[];
  periodo?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface ISource {
  nome?: string;
  identificador?: string;
  url_origem?: string;
  [key: string]: unknown;
}

export interface INlpPreprocessing {
  tokens_originais: string[];
  tokens_limpos: string[];
  stems: string[];
  lemmas: string[];
  texto_limpo: string;
}

export type RiscoNivel =
  | "sem_dados"
  | "baixo"
  | "moderado"
  | "elevado"
  | "alto"
  | "critico";

export interface IAhpConsistencia {
  lambda_max: number;
  ci: number;
  ri: number;
  cr: number;
  consistente: boolean;
}

export interface IAhpInfo {
  metodo: string;
  escala: string;
  criterios: string[];
  pesos: Record<string, number>;
  pesos_percentual: Record<string, number>;
  matriz_comparacao: number[][];
  consistencia: IAhpConsistencia;
  justificativa: string;
}

export interface INotaRisco {
  nota: number;
  nivel: RiscoNivel;
  fatores: string[];
  por_dimensao: Record<string, number>;
  sub_scores?: Record<string, number>;
  metodo_ahp?: IAhpInfo;
}

export interface IImovelInfo {
  cod_imovel: string;
  municipio: string;
  area_ha: number;
  status: string;
  ind_tipo?: string;
  des_condic?: string;
  dat_criacao?: string;
  dat_atualizacao?: string;
}

export type TipoAmeaca =
  | "queimada"
  | "desmatamento_deter"
  | "desmatamento_prodes"
  | "terra_indigena"
  | "unidade_conservacao"
  | "quilombola";

export interface ISobreposicaoTI {
  nome: string;
  etnia?: string;
  fase?: string;
  area_sobreposicao_ha?: number;
}

export interface IAmeacaEncontrada {
  tipo: TipoAmeaca;
  quantidade?: number;
  dentro_imovel?: number;
  distancia_min_km?: number;
  frp_medio?: number;
  area_intersecao_km2?: number;
  area_hist_km2?: number;
  sobrepoe?: boolean;
  sobreposicoes?: ISobreposicaoTI[];
  proximas_10km?: number;
  protecao_integral?: number;
  no_municipio?: boolean;
}

export type EixoAgrupamento = "unico" | "municipio" | "intencao" | "composto";

export interface IIntencaoDetectada {
  intencao: string;
  confianca: number;
}

export interface IGrupoFiltros {
  municipio?: string | null;
  intencao?: string | null;
  cod_imovel?: string | null;
}

export interface IGrupoResposta {
  rotulo: string;
  filtros: IGrupoFiltros;
  resumo: string;
  estatisticas: Record<string, number>;
  total_resultados: number;
  nota_risco?: INotaRisco | null;
  fontes?: ISource[];
}

export interface IQueryResponse {
  pergunta: string;
  intencao_detectada: string;
  confianca: number;
  entidades: IEntities;
  resumo: string;
  estatisticas: Record<string, number>;
  dados: (AsgRecord | TFlatMetadata)[];
  fontes: ISource[];
  geojson?: IAsgFeatureCollection | null;
  total_resultados: number;
  tempo_processamento_ms: number;
  preprocessamento?: INlpPreprocessing | null;
  nota_risco?: INotaRisco | null;
  // Campos da consulta por código CAR (cruzamento espacial)
  imovel?: IImovelInfo | null;
  ameacas_encontradas?: IAmeacaEncontrada[] | null;
  // Consulta multi-intenção (múltiplos municípios e/ou temas)
  grupos?: IGrupoResposta[] | null;
  eixo_agrupamento?: EixoAgrupamento | null;
  intencoes_detectadas?: IIntencaoDetectada[] | null;
}
