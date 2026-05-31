import { IQgisCatalog, QgisFilterValues } from "@/interfaces/services/QgisService";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { BaseService } from "./BaseService";
import { getQgisApiBaseUrl } from "@/utils/api";

const cleanParams = (params: QgisFilterValues): Record<string, string> => {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    const str = String(value).trim();

    if (!str) continue;

    out[key] = str;
  }

  return out;
};

export const QgisService = {
  getCatalogo: async (): Promise<IQgisCatalog> => {
    return BaseService.get<IQgisCatalog>("/geo/catalogo");
  },

  buildLayerUrl: (
    layerPath: string,
    params: QgisFilterValues
  ): string => {
    const cleaned = cleanParams(params);

    const query = new URLSearchParams(cleaned).toString();

    let path = layerPath.startsWith("/")
      ? layerPath
      : `/${layerPath}`;

    const apiBase = getQgisApiBaseUrl();

    if (
      apiBase.endsWith("/api") &&
      path.startsWith("/api/")
    ) {
      path = path.slice(4);
    }

    const url = `${apiBase}${path}`;

    return query ? `${url}?${query}` : url;
  },

  fetchLayerGeoJSON: async (
    layerPath: string,
    params: QgisFilterValues,
  ): Promise<{
    data: IGeoJSONFeatureCollection;
    tempoMs: number;
    tamanhoBytes: number;
  }> => {
    const url = QgisService.buildLayerUrl(layerPath, params);

    const inicio = performance.now();

    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(
        `Erro ${resp.status} ao buscar camada: ${resp.statusText}`
      );
    }

    const texto = await resp.text();

    const tempoMs = Math.round(performance.now() - inicio);

    const tamanhoBytes = new Blob([texto]).size;

    const data = JSON.parse(texto) as IGeoJSONFeatureCollection;

    return {
      data,
      tempoMs,
      tamanhoBytes,
    };
  },
};