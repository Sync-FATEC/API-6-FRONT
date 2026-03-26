import { GeoJSONFeatureCollection } from "../geojson";
import { JsonObject } from "../json";

export interface IEntities {
  municipios?: string[];
  periodo?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface QueryResponse {
  pergunta: string;
  intencao_detectada: string;
  confianca: number;
  entidades: IEntities;
  resumo: string;
  estatisticas: Record<string, number>;
  dados: JsonObject[];
  fontes: { nome: string; identificador: string }[];
  geojson: GeoJSONFeatureCollection;
  total_resultados?: number;
  tempo_processamento_ms?: number;
}
