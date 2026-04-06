import { MapSourceConfig } from "@/interfaces/components/map";

export const MAP_SOURCES: Record<string, MapSourceConfig> = {
  queimadas: {
    color: "#ff4444", // Vermelho
    label: "Queimada",
    icon: "flame",
  },
  deter: {
    color: "#f06400", // Laranja Escuro
    label: "Alerta Desmatamento",
    icon: "axe",
  },
  prodes: {
    color: "#f77f00", // Laranja
    label: "Área Desmatada",
    icon: "axe",
  },
  funai: {
    color: "#55a630", // Verde
    label: "Terra Indígena",
    icon: "leaf",
  },
  icmbio: {
    color: "#9d4edd", // Roxo
    label: "Unidade de Conservação",
    icon: "shield",
  },
  palmares: {
    color: "#7A360F", // Marrom
    label: "Quilombo",
    icon: "fist",
  },
  sicar: {
    color: "#16acf7", // Azul Claro
    label: "Imóvel Rural",
    icon: "farm",
  },
  desconhecida: {
    color: "#888888", // Cinza
    label: "Desconhecida",
    icon: "help",
  },
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
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

export type TMapProvider = keyof typeof MAP_PROVIDERS;

export const MAP_ANIMATION = {
  duration: 1.2,
  padding: [50, 50] as [number, number],
  pointZoom: 14,
};
