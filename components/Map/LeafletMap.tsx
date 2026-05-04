"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import MapViewToggle from "./components/MapViewToggle";
import StateOutline from "./components/StateOutline";
import MapLegend from "./components/Legend";
import { INTENTION_TEMPLATES } from "./components/MapDetails";
import { MAP_PROVIDERS, INITIAL_CENTER, INITIAL_ZOOM, MAP_SOURCES } from "@/constants/map";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { useLeafletMap } from "./useMap";
import MapSearchInput from "./components/SearchInput";
import type { FiltroMapaDia } from "@/contexts/DaySelectionContext";

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

function SearchLocationController({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

interface Props {
  geoJsonData: IGeoJSONFeatureCollection;
  intention: string | null;
  dayFilter?: FiltroMapaDia;
  dataSelecionada?: string;
  onPointClick?: (text: string) => void;
}

export default function LeafletMap({ geoJsonData, intention, dayFilter, dataSelecionada, onPointClick }: Props) {
  const {
    mapType,
    setMapType,
    searchedLocation,
    searchError,
    clearSearchError,
    availableSources,
    activeSources,
    filteredGeoJson,
    geoJsonKey,
    toggleSource,
    handleSearch,
    handlePointClick,
  } = useLeafletMap({ geoJsonData, intention, dayFilter, dataSelecionada, onPointClick });

  const currentProvider = MAP_PROVIDERS[mapType];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden z-0">
      <MapSearchInput
        onSearch={handleSearch}
        errorMessage={searchError}
        onClearError={clearSearchError}
      />{" "}
      <MapViewToggle activeType={mapType} onChange={setMapType} />
      <MapLegend
        availableSources={availableSources}
        activeSources={activeSources}
        onToggle={toggleSource}
      />
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController geoJsonData={filteredGeoJson as IGeoJSONFeatureCollection} />
        <SearchLocationController position={searchedLocation} />

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
              
              // Adicionar handler de clique se é dia selecionado
              if (dataSelecionada) {
                layer.on("click", () => {
                  handlePointClick(feature);
                });
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
