import {
  IFireMetadata,
  IIndigenousLandMetadata,
  IDeforestationMetadata,
  IConservationUnitMetadata,
  IProdesMetadata,
  IQuilombolaMetadata,
  IFarmMetadata,
} from "./metadata";

export interface IBaseRecord {
  id?: number | string;
  fonte?: string;
  municipio?: string | null;
  data_referencia?: string | null;
  texto?: string;
  similaridade?: number;
}

export interface IFireRecord extends IBaseRecord {
  tipo_registro: "foco_queimada";
  metadados_json: IFireMetadata;
}

export interface IIndigenousLandRecord extends IBaseRecord {
  tipo_registro: "terra_indigena";
  metadados_json: IIndigenousLandMetadata;
}

export interface IDeforestationRecord extends IBaseRecord {
  tipo_registro: "alerta_desmatamento";
  metadados_json: IDeforestationMetadata;
}

export interface IConservationUnitRecord extends IBaseRecord {
  tipo_registro: "unidade_conservacao";
  metadados_json: IConservationUnitMetadata;
}

export interface IProdesRecord extends IBaseRecord {
  tipo_registro: "desmatamento_prodes";
  metadados_json: IProdesMetadata;
}

export interface IQuilombolaRecord extends IBaseRecord {
  tipo_registro: "comunidade_quilombola";
  metadados_json: IQuilombolaMetadata;
}

export interface ISicarRecord extends IBaseRecord {
  tipo_registro: "imovel_sicar";
  metadados_json: IFarmMetadata;
}

export interface IGenericRecord extends IBaseRecord {
  tipo_registro: string;
  metadados_json: Record<string, unknown>;
}

export type AsgRecord =
  | IFireRecord
  | IIndigenousLandRecord
  | IDeforestationRecord
  | IConservationUnitRecord
  | IProdesRecord
  | IQuilombolaRecord
  | ISicarRecord
  | IGenericRecord;
