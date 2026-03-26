"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoJSONFeatureCollection } from "@/interfaces/geojson";

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface Props {
  geoJsonData: GeoJSONFeatureCollection;
}

export default function LeafletMap({ geoJsonData }: Props) {
  return (
    <MapContainer
      center={[-22.5, -48.5]}
      zoom={7}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution="&copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {geoJsonData && (
        <GeoJSON
          key={JSON.stringify(geoJsonData)}
          data={geoJsonData}
          style={() => ({
            color: "#9b59b6",
            weight: 3,
            fillColor: "#9b59b6",
            fillOpacity: 0.25,
          })}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 10,
              fillColor: "#e056c1",
              color: "#fff",
              weight: 2,
              fillOpacity: 0.9,
            });
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties?.texto) {
              layer.bindPopup(`<div style="max-width:320px;">${feature.properties.texto}</div>`);
            }
          }}
        />
      )}
    </MapContainer>
  );
}
