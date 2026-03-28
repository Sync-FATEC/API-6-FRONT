export interface IGeoPropsFires {
  fonte: "queimadas";
  municipio: string | null;
  satelite: string | null;
  data_hora: string | null;
  bioma: string | null;
  frp: string | null;
  risco_fogo: string | null;
}

export interface IGeoPropsFunai {
  fonte: "funai";
  nome: string | null;
  etnia: string | null;
  municipio: string | null;
  area_ha: string | null;
  fase: string | null;
}

export interface IGeoPropsDeter {
  fonte: "deter";
  classe: string | null;
  municipio: string | null;
  data_avistamento: string | null;
  area_total_km2: string | null;
}

export interface IGeoPropsProdes {
  fonte: "prodes";
  estado: string | null;
  classe_nome: string | null;
  data_imagem: string | null;
  ano: string | null;
  area_km: string | null;
  fonte_bioma: string | null;
  satelite: string | null;
}

export interface IGeoPropsPalmares {
  fonte: "palmares";
  municipio: string | null;
  comunidade: string | null;
  ano_certificacao: string | null;
  processo_fcp: string | null;
  processo_incra: string | null;
}

export interface IGeoPropsGeneric {
  fonte?: string;
  [key: string]: string | null | undefined;
}

export type GeoJSONProperties = 
  | IGeoPropsFires 
  | IGeoPropsFunai 
  | IGeoPropsDeter 
  | IGeoPropsProdes 
  | IGeoPropsPalmares 
  | IGeoPropsGeneric;