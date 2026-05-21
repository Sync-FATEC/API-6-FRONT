export type QgisFilterKey =
  | "municipio"
  | "data_inicio"
  | "data_fim"
  | "bbox"
  | "limite"
  | "offset"
  | "ano"
  | "cod_imovel"
  | "ind_status"
  | "classe"
  | "simplify";

export interface IQgisFilterLimit {
  min?: number;
  max?: number;
  default?: number;
  formato?: string;
}

export interface IQgisLayer {
  id: string;
  nome: string;
  fonte: string;
  geometria: "Point" | "MultiPolygon" | "Geometry" | null;
  srid: number | null;
  atributos: string[];
  filtros: QgisFilterKey[];
  limites?: Partial<Record<QgisFilterKey, IQgisFilterLimit>>;
  url: string;
  descricao: string;
}

export interface IQgisCatalog {
  versao: string;
  srid_saida: number;
  media_type: string;
  instrucoes_qgis: string;
  camadas: IQgisLayer[];
}

export type QgisFilterValues = Partial<Record<QgisFilterKey, string | number | undefined>>;
