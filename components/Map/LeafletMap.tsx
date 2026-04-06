"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapViewToggle from "./components/MapViewToggle";
import StateOutline from "./components/StateOutline";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";

import { MAP_PROVIDERS, INITIAL_CENTER, INITIAL_ZOOM, MAP_SOURCES } from "@/constants/map";
import { INTENTION_TEMPLATES } from "./components/MapDetails";
import MapLegend from "./components/Legend";
import { extractSpRings, isFeatureInSaoPaulo, Position } from "./Calculation";

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
      ) || [],
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
