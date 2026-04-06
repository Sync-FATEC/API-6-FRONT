"use client";

import { useState, useEffect } from "react";
import { GeoJSON } from "react-leaflet";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import * as MapConfig from "@/constants/map";

interface StateOutlineProps {
  mapType: MapConfig.TMapProvider;
}

export default function StateOutline({ mapType }: StateOutlineProps) {
  const [outline, setOutline] = useState<IGeoJSONFeatureCollection | null>(null);

  useEffect(() => {
    fetch("/data/estado-sp.json")
      .then((response) => response.json())
      .then((data) => setOutline(data as IGeoJSONFeatureCollection))
      .catch((error) => console.error("Erro ao carregar perímetro de SP:", error));
  }, []);

  if (!outline) return null;

  const outlineColor = mapType === "satellite" ? "#FFFFFF" : "#64748b";

  return (
    <GeoJSON
      data={outline}
      style={{
        color: outlineColor,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0,
        dashArray: "6, 6",
        interactive: false,
      }}
    />
  );
}