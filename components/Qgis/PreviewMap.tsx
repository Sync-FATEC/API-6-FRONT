"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import {
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAP_PROVIDERS,
  MAP_SOURCES,
  TMapProvider,
} from "@/constants/map";
import StateOutline from "@/components/Map/components/StateOutline";
import MapViewToggle from "@/components/Map/components/MapViewToggle";
import { IQgisLayer } from "@/interfaces/services/QgisService";

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const FONTE_PARA_KEY: Record<string, string> = {
  INPE: "queimadas",
  FUNAI: "funai",
  "DETER/INPE": "deter",
  "PRODES/INPE": "prodes",
  SICAR: "sicar",
  "ICMBio/MMA": "icmbio",
  "Fundacao Cultural Palmares": "palmares",
};

function FitBoundsController({ data }: { data: IGeoJSONFeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!data?.features?.length) return;
    const layer = L.geoJSON(data as IGeoJSONFeatureCollection);
    const bounds = layer.getBounds();
    if (!bounds.isValid()) return;
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      map.flyTo(bounds.getCenter(), 14, { duration: 1.2 });
    } else {
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1.2 });
    }
  }, [data, map]);
  return null;
}

interface Props {
  data: IGeoJSONFeatureCollection | null;
  camada: IQgisLayer | null;
}

export default function PreviewMap({ data, camada }: Props) {
  const [mapType, setMapType] = useState<TMapProvider>("satellite");
  const currentProvider = MAP_PROVIDERS[mapType];

  const fonteKey = camada ? FONTE_PARA_KEY[camada.fonte] ?? "desconhecida" : "desconhecida";
  const cfg = MAP_SOURCES[fonteKey] ?? MAP_SOURCES.desconhecida;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden z-0">
      <MapViewToggle activeType={mapType} onChange={setMapType} />

      {camada && (
        <div className="absolute bottom-6 left-6 z-1000 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
          <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-2">
            Legenda
          </h4>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cfg.color }}
            />
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              {cfg.label}
            </span>
          </div>
        </div>
      )}

      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={mapType}
          url={currentProvider.url}
          attribution={currentProvider.attribution}
        />
        <StateOutline mapType={mapType} />
        <FitBoundsController data={data} />

        {data && data.features?.length > 0 && (
          <GeoJSON
            key={data.features.length}
            data={data as IGeoJSONFeatureCollection}
            style={() => ({
              color: cfg.color,
              weight: 3,
              fillColor: cfg.color,
              fillOpacity: 0.25,
            })}
            pointToLayer={(_feature, latlng) =>
              L.circleMarker(latlng, {
                radius: 8,
                fillColor: cfg.color,
                color: "#fff",
                weight: 2,
                fillOpacity: 0.95,
              })
            }
            onEachFeature={(feature, layer) => {
              const props = feature.properties || {};
              const ignorar = new Set(["fonte"]);
              const html = Object.entries(props)
                .filter(([k, v]) => !ignorar.has(k) && v !== null && v !== undefined && v !== "")
                .slice(0, 12)
                .map(
                  ([k, v]) =>
                    `<div class="flex justify-between gap-3 text-xs py-0.5">
                      <span class="font-semibold text-slate-600">${k}</span>
                      <span class="text-slate-800 text-right truncate max-w-[180px]">${String(v)}</span>
                    </div>`,
                )
                .join("");
              const title = camada
                ? `<div class="font-bold text-primary mb-1 pb-1 border-b border-slate-200">${
                    cfg.label
                  }</div>`
                : "";
              layer.bindPopup(`<div class="min-w-[220px]">${title}${html}</div>`, {
                maxWidth: 320,
                className: "custom-popup",
                closeButton: false,
                offset: [0, -8] as L.PointTuple,
              });
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
