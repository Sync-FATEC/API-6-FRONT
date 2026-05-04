export type Position = [number, number];

export type Bounds = {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
};

export const SP_BOUNDS: Bounds = {
  minLon: -53.2,
  minLat: -25.4,
  maxLon: -44.1,
  maxLat: -19.8,
};

export const intersects = (a: Bounds, b: Bounds) => {
  return !(a.maxLon < b.minLon || a.minLon > b.maxLon || a.maxLat < b.minLat || a.minLat > b.maxLat);
};

export const mergeBounds = (a: Bounds | null, b: Bounds | null): Bounds | null => {
  if (!a) return b;
  if (!b) return a;
  return {
    minLon: Math.min(a.minLon, b.minLon),
    minLat: Math.min(a.minLat, b.minLat),
    maxLon: Math.max(a.maxLon, b.maxLon),
    maxLat: Math.max(a.maxLat, b.maxLat),
  };
};

export const boundsFromCoordinates = (coords: unknown): Bounds | null => {
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

export const pointInRing = (point: Position, ring: Position[]): boolean => {
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

export const extractSpRings = (outline: unknown): Position[][] => {
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

export const hasAnyPointInsideRings = (coords: unknown, rings: Position[][]): boolean => {
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

export const boundsFromGeometry = (geometry: unknown): Bounds | null => {
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

export const isFeatureInSaoPaulo = (feature: unknown, spRings: Position[][]): boolean => {
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