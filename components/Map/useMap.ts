import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MAP_PROVIDERS } from "@/constants/map";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { extractSpRings, isFeatureInSaoPaulo } from "./Calculation";
import type { FiltroMapaDia } from "@/contexts/DaySelectionContext";

interface Props {
  geoJsonData: IGeoJSONFeatureCollection | null;
  intention: string | null;
  dayFilter?: FiltroMapaDia;
  dataSelecionada?: string;
  onPointClick?: (text: string) => void;
}

export function useLeafletMap({ geoJsonData, intention, dayFilter, dataSelecionada, onPointClick }: Props) {
  const [mapType, setMapType] = useState<keyof typeof MAP_PROVIDERS>("satellite");
  const [hiddenSources, setHiddenSources] = useState<string[]>([]);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: spRings = [] } = useQuery({
    queryKey: ["estado-sp-rings"],
    queryFn: async () => {
      const response = await fetch("/data/estado-sp.json");
      if (!response.ok) throw new Error("Erro ao carregar mapa de SP");
      const data = await response.json();
      return extractSpRings(data);
    },
    staleTime: Infinity,
  });

  // Converter dados do dia em GeoJSON
  const dayFilterGeoJson = useMemo(() => {
    if (!dayFilter || !dataSelecionada) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = [];

    // Adicionar queimadas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayFilter.queimadasDia?.forEach((item: any) => {
      if (item.longitude && item.latitude) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
          properties: {
            fonte: "queimadas",
            data: item.data_hora,
            tipo: "queimada",
            ...item,
          },
        });
      }
    });

    // Adicionar desmatamento
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayFilter.desmatamentoDia?.forEach((item: any) => {
      if (item.longitude && item.latitude) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
          properties: {
            fonte: "deter",
            data: item.data_avistamento,
            tipo: "desmatamento",
            ...item,
          },
        });
      }
    });

    // Adicionar SICAR
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayFilter.sicarDia?.forEach((item: any) => {
      if (item.geometry) {
        features.push({
          type: "Feature",
          geometry: item.geometry,
          properties: {
            fonte: "sicar",
            data: item.data_criacao,
            tipo: "sicar",
            ...item,
          },
        });
      }
    });

    // Adicionar PRODES
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayFilter.prodesDia?.forEach((item: any) => {
      if (item.longitude && item.latitude) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
          properties: {
            fonte: "prodes",
            data: item.data_imagem,
            tipo: "prodes",
            ...item,
          },
        });
      } else if (item.geometry) {
        features.push({
          type: "Feature",
          geometry: item.geometry,
          properties: {
            fonte: "prodes",
            data: item.data_imagem,
            tipo: "prodes",
            ...item,
          },
        });
      }
    });

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [dayFilter, dataSelecionada]);

  // Handler para clique em pontos do mapa
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointClick = (feature: any) => {
    if (!onPointClick || !dataSelecionada) return;

    const properties = feature.properties || {};
    const tipo = properties.tipo || properties.fonte;

    let query = "";

    if (tipo === "desmatamento" || tipo === "Desmatamento") {
      query = `Desmatamentos em ${dataSelecionada}`;
    } else if (tipo === "queimada" || tipo === "Queimadas") {
      query = `Queimadas em ${dataSelecionada}`;
    } else if (tipo === "sicar" || tipo === "SICAR") {
      query = `Imóveis rurais (SICAR) em ${dataSelecionada}`;
    } else if (tipo === "prodes" || tipo === "PRODES") {
      query = `Desmatamentos PRODES em ${dataSelecionada}`;
    } else {
      query = `Dados de ${tipo} em ${dataSelecionada}`;
    }

    onPointClick(query);
  };

  const searchMutation = useMutation({
    mutationFn: async (term: string) => {
      setSearchError(null);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          term
        )}&countrycodes=br`,
        { headers: { "User-Agent": "VisionaGeoQuery/1.0" } }
      );
      if (!response.ok) throw new Error("Erro na busca");
      return response.json();
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setSearchedLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setSearchError("Endereço não encontrado. Tente ser mais específico.");
      }
    },
    onError: (error) => {
      console.error("Erro ao buscar endereço:", error);
      setSearchError("Ocorreu um erro inesperado ao buscar o endereço.");
    },
  });

  // Se tem filtro de dia, usar os dados do dia; caso contrário, usar geoJsonData
  const dataToUse = dayFilterGeoJson || geoJsonData;

  const geoJsonMaskedSP = useMemo(() => {
    if (!dataToUse) return null;
    return {
      ...dataToUse,
      features: dataToUse.features?.filter((f) => isFeatureInSaoPaulo(f, spRings)) || [],
    };
  }, [dataToUse, spRings]);

  const availableSources = useMemo(() => {
    return Array.from(
      new Set(geoJsonMaskedSP?.features?.map((f) => String(f.properties?.fonte)) || [])
    ).filter((s) => s !== "undefined" && s !== "null");
  }, [geoJsonMaskedSP]);

  const activeSources = availableSources.filter((s) => !hiddenSources.includes(s));

  const filteredGeoJson = useMemo(() => {
    if (!geoJsonMaskedSP) return null;
    return {
      ...geoJsonMaskedSP,
      features:
        geoJsonMaskedSP.features?.filter(
          (f) => !hiddenSources.includes(String(f.properties?.fonte))
        ) || [],
    };
  }, [geoJsonMaskedSP, hiddenSources]);

  const geoJsonKey = `${intention}-${dataSelecionada}-${filteredGeoJson?.features.length}-${hiddenSources.join(",")}`;

  const toggleSource = (source: string) => {
    setHiddenSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      searchMutation.mutate(term);
    }
  };

  return {
    mapType,
    setMapType,
    searchedLocation,
    searchError,
    clearSearchError: () => setSearchError(null),
    availableSources,
    activeSources,
    filteredGeoJson,
    geoJsonKey,
    toggleSource,
    handleSearch,
    handlePointClick,
    isSearching: searchMutation.isPending,
  };
}
