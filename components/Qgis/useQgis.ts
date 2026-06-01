"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { QgisService } from "@/services/QgisService";
import { IQgisCatalog, IQgisLayer, QgisFilterValues } from "@/interfaces/services/QgisService";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";

const DEFAULT_VALUES_PER_LAYER: Record<string, QgisFilterValues> = {
  queimadas: { limite: 1000 },
  terras_indigenas: { limite: 500 },
  desmatamento: { limite: 1000 },
  prodes: { limite: 2000 },
  sicar: { limite: 500 },
  unidades_conservacao: { limite: 500 },
  quilombolas: { limite: 500 },
};

interface PreviewState {
  data: IGeoJSONFeatureCollection;
  tempoMs: number;
  tamanhoBytes: number;
}

export function useQgis() {
  const [selecionada, setSelecionada] = useState<IQgisLayer | null>(null);
  const [valores, setValores] = useState<QgisFilterValues>({});
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const {
    data: catalogo,
    isLoading: catalogoLoading,
    error: catalogoError,
  } = useQuery<IQgisCatalog>({
    queryKey: ["qgis-catalogo"],
    queryFn: QgisService.getCatalogo,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!selecionada && catalogo?.camadas?.length) {
      const primeira = catalogo.camadas[0];
      setSelecionada(primeira);
      setValores(DEFAULT_VALUES_PER_LAYER[primeira.id] ?? {});
    }
  }, [catalogo, selecionada]);

  const handleSelectCamada = (camada: IQgisLayer) => {
    setSelecionada(camada);
    setValores(DEFAULT_VALUES_PER_LAYER[camada.id] ?? {});
    setPreview(null);
  };

  const handleReset = () => {
    if (!selecionada) return;
    setValores(DEFAULT_VALUES_PER_LAYER[selecionada.id] ?? {});
    setPreview(null);
  };

  const url = useMemo(() => {
    if (!selecionada) return "";
    return QgisService.buildLayerUrl(selecionada.url, valores);
  }, [selecionada, valores]);

  const handlePreview = async () => {
    if (!selecionada) return;

    setLoadingPreview(true);

    try {
      const result = await QgisService.fetchLayerGeoJSON(selecionada.url, valores);

      setPreview(result);

      const total = result.data.features?.length ?? 0;

      if (total === 0) {
        toast.warning("Sem features", {
          description: "Nenhum resultado para esses filtros.",
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";

      toast.error("Falha ao carregar camada", {
        description: msg,
      });

      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    if (!selecionada) return;
    try {
      const result = preview
        ? preview
        : await QgisService.fetchLayerGeoJSON(selecionada.url, valores);
      if (!preview) setPreview(result);
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/geo+json",
      });
      const a = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.download = `${selecionada.id}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
      toast.success("Download iniciado");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error("Falha no download", { description: msg });
    }
  };

  return {
    catalogo,
    catalogoLoading,
    catalogoError,
    selecionada,
    valores,
    setValores,
    url,
    preview,
    loadingPreview,
    handleSelectCamada,
    handleReset,
    handlePreview,
    handleDownload,
  };
}
