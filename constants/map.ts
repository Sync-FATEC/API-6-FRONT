export const COLORS: Record<string, { color: string; nome: string }> = {
  queimadas: { color: "#ff4444", nome: "Queimadas" },
  deter: { color: "#ff8c00", nome: "Desmatamento (DETER)" },
  funai: { color: "#4488ff", nome: "Terras Indígenas" },
  icmbio: { color: "#22cc66", nome: "Unidades de Conservação" },
  palmares: { color: "#7A360F", nome: "Quilombolas" },              // amber-900
  prodes: { color: "#cc6600", nome: "Desmatamento (PRODES)" },
};

export const DEFAULT_COLOR = "#fff";

export const INITIAL_CENTER: [number, number] = [-22.5, -48.5];
export const INITIAL_ZOOM = 7;
export const MAX_ZOOM = 18;
export const MIN_ZOOM = 6;

export const GEOJSON_STYLE = {
  weight: 3,
  fillOpacity: 0.25,
  pointRadius: 8,
  hoverOpacity: 0.5,
};

export const MAP_PROVIDERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

export type TMapProvider = keyof typeof MAP_PROVIDERS;

export const MAP_ANIMATION = {
  duration: 1.2,
  padding: [50, 50] as [number, number],
  pointZoom: 14,
};
