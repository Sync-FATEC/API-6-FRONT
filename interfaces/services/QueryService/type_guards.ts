import {
  AsgRecord,
  IFireRecord,
  IDeforestationRecord,
  IProdesRecord,
  IConservationUnitRecord,
  IIndigenousLandRecord,
  IQuilombolaRecord,
  ISicarRecord,
} from "./records";

import {
  GeoJSONProperties,
  IGeoPropsFires,
  IGeoPropsDeter,
  IGeoPropsProdes,
  IGeoPropsFunai,
  IGeoPropsPalmares,
  IGeoPropsSicar,
  IGeoPropsGeneric,
} from "./properties";

import {
  IFireMetadata,
  IQuilombolaMetadata,
  IDeforestationMetadata,
  IProdesMetadata,
  IConservationUnitMetadata,
  IIndigenousLandMetadata,
  IFarmMetadata,
} from "./metadata";

export const isFireRecord = (record: AsgRecord): record is IFireRecord =>
  record.tipo_registro === "foco_queimada";
export const isDeforestationRecord = (record: AsgRecord): record is IDeforestationRecord =>
  record.tipo_registro === "alerta_desmatamento";
export const isProdesRecord = (record: AsgRecord): record is IProdesRecord =>
  record.tipo_registro === "desmatamento_prodes";
export const isConservationUnitRecord = (record: AsgRecord): record is IConservationUnitRecord =>
  record.tipo_registro === "unidade_conservacao";
export const isIndigenousLandRecord = (record: AsgRecord): record is IIndigenousLandRecord =>
  record.tipo_registro === "terra_indigena";
export const isQuilombolaRecord = (record: AsgRecord): record is IQuilombolaRecord =>
  record.tipo_registro === "comunidade_quilombola";
export const isSicarRecord = (record: AsgRecord): record is ISicarRecord =>
  record.tipo_registro === "imovel_sicar";

export const isFireGeoProp = (props: GeoJSONProperties): props is IGeoPropsFires =>
  props.fonte === "queimadas";
export const isDeterGeoProp = (props: GeoJSONProperties): props is IGeoPropsDeter =>
  props.fonte === "deter";
export const isProdesGeoProp = (props: GeoJSONProperties): props is IGeoPropsProdes =>
  props.fonte === "prodes";
export const isFunaiGeoProp = (props: GeoJSONProperties): props is IGeoPropsFunai =>
  props.fonte === "funai";
export const isPalmaresGeoProp = (props: GeoJSONProperties): props is IGeoPropsPalmares =>
  props.fonte === "palmares";
export const isSicarGeoProp = (props: GeoJSONProperties): props is IGeoPropsSicar =>
  props.fonte === "sicar";

export const isRecordObject = (val: unknown): val is Record<string, unknown> => {
  return typeof val === "object" && val !== null;
};

export const isFireFlat = (d: unknown): d is IFireMetadata | IGeoPropsFires =>
  isRecordObject(d) && ("frp" in d || "risco_fogo" in d || "bioma" in d);

export const isQuilomboFlat = (d: unknown): d is IQuilombolaMetadata | IGeoPropsPalmares =>
  isRecordObject(d) && ("comunidade" in d || "processo_fcp" in d);

export const isDeterFlat = (d: unknown): d is IDeforestationMetadata | IGeoPropsDeter =>
  isRecordObject(d) && ("area_total_km2" in d || ("classe" in d && !("ano" in d)));

export const isProdesFlat = (d: unknown): d is IProdesMetadata | IGeoPropsProdes =>
  isRecordObject(d) && "ano" in d && ("classe" in d || "classe_nome" in d);

export const isFunaiFlat = (d: unknown): d is IIndigenousLandMetadata | IGeoPropsFunai =>
  isRecordObject(d) && ("etnia" in d || "fase" in d);

export const isIcmbioFlat = (d: unknown): d is IConservationUnitMetadata | IGeoPropsGeneric =>
  isRecordObject(d) && "categoria" in d && "esfera" in d;

export const isSicarFlat = (d: unknown): d is IFarmMetadata | IGeoPropsSicar =>
  isRecordObject(d) && "cod_imovel" in d;
