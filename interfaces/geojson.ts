import { JsonObject } from "./json";

export interface GeoJSONGeometry {
  type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection";
  coordinates: number[] | number[][] | number[][][] | number[][][][];
  crs?: {
    type: string;
    properties: Record<string, string>;
  };
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: JsonObject; 
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}