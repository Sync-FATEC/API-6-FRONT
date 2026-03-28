import { JsonObject } from "./json";

export interface IGeoJSONGeometry {
  type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection";
  coordinates: number[] | number[][] | number[][][] | number[][][][];
  crs?: {
    type: string;
    properties: Record<string, string>;
  };
}

export interface IGeoJSONFeature<P = JsonObject> {
  type: "Feature";
  geometry: IGeoJSONGeometry | null;
  properties: P;
}

export interface IGeoJSONFeatureCollection<P = JsonObject> {
  type: "FeatureCollection";
  features: IGeoJSONFeature<P>[];
}