"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapViewToggle from "./components/MapViewToggle";
import StateOutline from "./components/StateOutline";
import { GeoJSONFeatureCollection } from "@/interfaces/geojson";
import * as MapConfig from "@/constants/map";
import { INTENTION_TEMPLATES } from "./components/MapDetails";

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function MapController({ geoJsonData }: { geoJsonData: GeoJSONFeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geoJsonData?.features?.length) return;
    const layer = L.geoJSON(geoJsonData as GeoJSONFeatureCollection);
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
  geoJsonData: GeoJSONFeatureCollection;
  intention: string | null;
}

export default function LeafletMap({ geoJsonData, intention }: Props) {
  const [mapType, setMapType] = useState<MapConfig.TMapProvider>("satellite");
  const currentProvider = MapConfig.MAP_PROVIDERS[mapType];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden z-0">
      <MapViewToggle activeType={mapType} onChange={setMapType} />

      <MapContainer
        center={MapConfig.INITIAL_CENTER}
        zoom={MapConfig.INITIAL_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController geoJsonData={geoJsonData} />

        <TileLayer
          key={mapType}
          url={currentProvider.url}
          attribution={currentProvider.attribution}
        />
        <StateOutline mapType={mapType} />

        {geoJsonData && (
          <GeoJSON
            key={JSON.stringify(geoJsonData)}
            data={geoJsonData as GeoJSONFeatureCollection}
            style={(feature) => {
              const source = feature?.properties?.fonte as string;
              const color = MapConfig.COLORS[source]?.color || MapConfig.DEFAULT_COLOR;
              return { color: color, weight: 3, fillColor: color, fillOpacity: 0.25 };
            }}
            pointToLayer={(feature, latlng) => {
              const source = feature.properties.fonte as string;
              const color = MapConfig.COLORS[source]?.color || MapConfig.DEFAULT_COLOR;
              return L.circleMarker(latlng, {
                radius: 9,
                fillColor: color,
                color: "#fff",
                weight: 2,
                fillOpacity: 1,
              });
            }}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;
              const templateFn = INTENTION_TEMPLATES[intention || props.intencao];

              const content = templateFn
                ? templateFn(props)
                : `<div style="padding:10px;">${props.texto}</div>`;

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
