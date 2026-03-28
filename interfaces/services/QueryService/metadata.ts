export interface IFireMetadata {
  latitude: string | number;
  longitude: string | number;
  satelite: string;
  bioma: string;
  frp: string | number;
  risco_fogo: string | number;
}

export interface IIndigenousLandMetadata {
  nome: string;
  etnia: string;
  area_ha: string | number;
  fase: string;
  centroid_lon?: number | null;
  centroid_lat?: number | null;
}

export interface IDeforestationMetadata {
  classe: string;
  area_km2: string | number;
  satelite: string;
}

export interface IConservationUnitMetadata {
  nome: string;
  categoria: string;
  grupo: string;
  esfera: string;
  area_ha: string | number;
  centroid_lon?: number | null;
  centroid_lat?: number | null;
}

export interface IProdesMetadata {
  uid: string;
  ano: string | number;
  area_km: string | number;
  classe: string;
  bioma_fonte: string;
  satelite: string;
}

export interface IQuilombolaMetadata {
  comunidade: string;
  ano_certificacao: string;
  processo_fcp: string;
  processo_incra: string;
}


export type TFlatMetadata = 
  | IFireMetadata 
  | IIndigenousLandMetadata 
  | IDeforestationMetadata 
  | IConservationUnitMetadata 
  | IProdesMetadata 
  | IQuilombolaMetadata 