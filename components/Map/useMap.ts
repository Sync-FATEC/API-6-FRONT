import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MAP_PROVIDERS } from "@/constants/map";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { extractSpRings, isFeatureInSaoPaulo } from "./Calculation";

interface Props {
  geoJsonData: IGeoJSONFeatureCollection | null;
  intention: string | null;
}

export function useLeafletMap({ geoJsonData, intention }: Props) {
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

  const geoJsonMaskedSP = useMemo(() => {
    if (!geoJsonData) return null;
    return {
      ...geoJsonData,
      features: geoJsonData.features?.filter((f) => isFeatureInSaoPaulo(f, spRings)) || [],
    };
  }, [geoJsonData, spRings]);

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

  const geoJsonKey = `${intention}-${filteredGeoJson?.features.length}-${hiddenSources.join(",")}`;

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
    isSearching: searchMutation.isPending,
  };
}
