"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapViewToggle from "./components/MapViewToggle";
import StateOutline from "./components/StateOutline";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";

import { MAP_PROVIDERS, INITIAL_CENTER, INITIAL_ZOOM, MAP_SOURCES } from "@/constants/map";
import { INTENTION_TEMPLATES } from "./components/MapDetails";
import MapLegend from "./components/Legend";
import React from "react";

type Position = [number, number];

type Bounds = {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
};

const SP_BOUNDS: Bounds = {
  minLon: -53.2,
  minLat: -25.4,
  maxLon: -44.1,
  maxLat: -19.8,
};

const intersects = (a: Bounds, b: Bounds) => {
  return !(a.maxLon < b.minLon || a.minLon > b.maxLon || a.maxLat < b.minLat || a.minLat > b.maxLat);
};

const mergeBounds = (a: Bounds | null, b: Bounds | null): Bounds | null => {
  if (!a) return b;
  if (!b) return a;
  return {
    minLon: Math.min(a.minLon, b.minLon),
    minLat: Math.min(a.minLat, b.minLat),
    maxLon: Math.max(a.maxLon, b.maxLon),
    maxLat: Math.max(a.maxLat, b.maxLat),
  };
};

const boundsFromCoordinates = (coords: unknown): Bounds | null => {
  if (!Array.isArray(coords) || coords.length === 0) return null;

  const first = coords[0];
  if (typeof first === "number") {
    if (coords.length < 2) return null;
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { minLon: lon, minLat: lat, maxLon: lon, maxLat: lat };
  }

  let acc: Bounds | null = null;
  for (const child of coords) {
    acc = mergeBounds(acc, boundsFromCoordinates(child));
  }
  return acc;
};

const pointInRing = (point: Position, ring: Position[]): boolean => {
  let inside = false;
  const [x, y] = point;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const extractSpRings = (outline: unknown): Position[][] => {
  if (!outline || typeof outline !== "object") return [];

  const data = outline as {
    features?: Array<{ geometry?: { type?: string; coordinates?: unknown } }>;
  };

  const rings: Position[][] = [];
  const features = Array.isArray(data.features) ? data.features : [];

  for (const feature of features) {
    const geom = feature.geometry;
    if (!geom) continue;

    if (geom.type === "Polygon") {
      const polyCoords = Array.isArray(geom.coordinates) ? geom.coordinates : [];
      if (Array.isArray(polyCoords[0])) {
        rings.push((polyCoords[0] as unknown[]).filter(Array.isArray).map((p) => [Number((p as number[])[0]), Number((p as number[])[1])]));
      }
    }

    if (geom.type === "MultiPolygon") {
      const multi = Array.isArray(geom.coordinates) ? geom.coordinates : [];
      for (const polygon of multi) {
        if (!Array.isArray(polygon) || !Array.isArray(polygon[0])) continue;
        rings.push((polygon[0] as unknown[]).filter(Array.isArray).map((p) => [Number((p as number[])[0]), Number((p as number[])[1])]));
      }
    }
  }

  return rings.filter((r) => r.length >= 3);
};

const hasAnyPointInsideRings = (coords: unknown, rings: Position[][]): boolean => {
  if (!Array.isArray(coords) || coords.length === 0) return false;

  const first = coords[0];
  if (typeof first === "number") {
    if (coords.length < 2) return false;
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return false;
    return rings.some((ring) => pointInRing([lon, lat], ring));
  }

  return coords.some((child) => hasAnyPointInsideRings(child, rings));
};

const boundsFromGeometry = (geometry: unknown): Bounds | null => {
  if (!geometry || typeof geometry !== "object") return null;

  const geo = geometry as {
    type?: string;
    coordinates?: unknown;
    geometries?: unknown[];
  };

  if (geo.type === "GeometryCollection") {
    const items = Array.isArray(geo.geometries) ? geo.geometries : [];
    let acc: Bounds | null = null;
    for (const item of items) {
      acc = mergeBounds(acc, boundsFromGeometry(item));
    }
    return acc;
  }

  return boundsFromCoordinates(geo.coordinates);
};

const isFeatureInSaoPaulo = (feature: unknown, spRings: Position[][]): boolean => {
  if (!feature || typeof feature !== "object") return false;
  const maybeFeature = feature as { geometry?: unknown };

  if (spRings.length > 0) {
    const geometry = maybeFeature.geometry as { type?: string; coordinates?: unknown; geometries?: unknown[] } | undefined;
    if (!geometry) return false;

    if (geometry.type === "GeometryCollection") {
      const geometries = Array.isArray(geometry.geometries) ? geometry.geometries : [];
      return geometries.some((g) => {
        const gg = g as { coordinates?: unknown };
        return hasAnyPointInsideRings(gg.coordinates, spRings);
      });
    }

    return hasAnyPointInsideRings(geometry.coordinates, spRings);
  }

  const bounds = boundsFromGeometry(maybeFeature.geometry);
  if (!bounds) return false;
  return intersects(bounds, SP_BOUNDS);
};

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function MapController({ geoJsonData }: { geoJsonData: IGeoJSONFeatureCollection | null }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData?.features?.length) return;
    const layer = L.geoJSON(geoJsonData as IGeoJSONFeatureCollection);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        map.flyTo(bounds.getCenter(), 14, { duration: 1.2 });
      } else {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1.2 });
      }
    }
  }, [geoJsonData, map]);

  return null;
}

interface Props {
  geoJsonData: IGeoJSONFeatureCollection;
  intention: string | null;
}

export default function LeafletMap({ geoJsonData, intention }: Props) {
  const [mapType, setMapType] = useState<keyof typeof MAP_PROVIDERS>("satellite");
  const currentProvider = MAP_PROVIDERS[mapType];

  const [hiddenSources, setHiddenSources] = useState<string[]>([]);
  const [spRings, setSpRings] = useState<Position[][]>([]);

  useEffect(() => {
    fetch("/data/estado-sp.json")
      .then((response) => response.json())
      .then((data) => setSpRings(extractSpRings(data)))
      .catch(() => setSpRings([]));
  }, []);

  const geoJsonMaskedSP = React.useMemo(() => {
    return {
      ...geoJsonData,
      features: geoJsonData?.features?.filter((f) => isFeatureInSaoPaulo(f, spRings)) || [],
    };
  }, [geoJsonData, spRings]);

  const availableSources = React.useMemo(() => {
    return Array.from(
      new Set(geoJsonMaskedSP?.features?.map((f) => String(f.properties?.fonte)) || [])
    ).filter((s) => s !== "undefined" && s !== "null");
  }, [geoJsonMaskedSP]);

  const activeSources = availableSources.filter((s) => !hiddenSources.includes(s));

  const filteredGeoJson = {
    ...geoJsonMaskedSP,
    features:
      geoJsonMaskedSP?.features?.filter(
        (f) => !hiddenSources.includes(String(f.properties?.fonte))
      ) ||
      [],
  };

  const geoJsonKey = `${intention}-${filteredGeoJson.features.length}-${hiddenSources.join(",")}`;

  const toggleSource = (source: string) => {
    setHiddenSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden z-0">
      <MapViewToggle activeType={mapType} onChange={setMapType} />

      <MapLegend
        availableSources={availableSources}
        activeSources={activeSources}
        onToggle={toggleSource}
      />
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController geoJsonData={filteredGeoJson} />

        <TileLayer
          key={mapType}
          url={currentProvider.url}
          attribution={currentProvider.attribution}
        />
        <StateOutline mapType={mapType} />

        {filteredGeoJson && (
          <GeoJSON
            key={geoJsonKey}
            data={filteredGeoJson as IGeoJSONFeatureCollection}
            style={(feature) => {
              const source = String(feature?.properties?.fonte || "");
              const color = MAP_SOURCES[source]?.color || "#334155";
              return { color, weight: 3, fillColor: color, fillOpacity: 0.25 };
            }}
            pointToLayer={(feature, latlng) => {
              const source = String(feature?.properties?.fonte || "");
              const color = MAP_SOURCES[source]?.color || "#334155";
              return L.circleMarker(latlng, {
                radius: 16,
                fillColor: color,
                color: "#fff",
                weight: 2,
                fillOpacity: 1,
              });
            }}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;

              const content = INTENTION_TEMPLATES[intention || String(props.intencao)](props);

              layer.bindPopup(content, {
                maxWidth: 500,
                className: "custom-popup",
                closeButton: false,
                offset: [0, -10],
              });
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
