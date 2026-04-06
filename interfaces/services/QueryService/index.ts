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
}
