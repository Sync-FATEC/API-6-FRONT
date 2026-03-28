import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { GeoJSONProperties } from "./properties";

export interface IConservationUnitGeoJSONRow {
  nome: string;
  categoria: string;
  grupo: string;
  esfera: string;
  municipio: string;
  area_ha: number;
}

export interface IAsgFeatureCollection extends IGeoJSONFeatureCollection<GeoJSONProperties> {
  nota?: string;
  dados?: IConservationUnitGeoJSONRow[];
}