import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/DashboardService";
import { IDashboardStats } from "@/interfaces/services/DashboardService";
import { useDaySelection } from "@/contexts/DaySelectionContext";

const processTimeSeriesData = (
  data: Array<{ [key: string]: unknown }>,
  dateField: string,
  hasFilter: boolean = false
): Array<{ data: string; quantidade: number }> => {
  const grouped: Record<string, number> = {};

  data.forEach((item) => {
    let dateStr = "Sem data";

    if (item[dateField]) {
      dateStr = String(item[dateField]).slice(0, 10);
    }

    grouped[dateStr] = (grouped[dateStr] || 0) + 1;
  });

  const result = Object.entries(grouped)
    .map(([date, count]) => {
      if (date === "Sem data") {
        return { data: date, quantidade: count };
      }

      const [year, month, day] = date.split("-");
      return { data: `${day}/${month}/${year}`, quantidade: count };
    })
    .sort((a, b) => {
      if (a.data === "Sem data") return 1;
      if (b.data === "Sem data") return -1;

      const [dayA, monthA, yearA] = a.data.split("/");
      const [dayB, monthB, yearB] = b.data.split("/");

      return (
        new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
        new Date(`${yearB}-${monthB}-${dayB}`).getTime()
      );
    });

  return hasFilter ? result : result.slice(-50);
};

export function useDashboard() {
  const { setDaySelection } = useDaySelection();

  const [stats, setStats] = useState<IDashboardStats | null>(null);

  const [queimadas, setQueimadas] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [desmatamento, setDesmatamento] = useState<Array<{ data: string; quantidade: number }>>([]);

  const defaultInicio = "2020-01-01";
  const defaultFim = new Date().toISOString().split("T")[0];

  const [dataInicio, setDataInicio] = useState<string>(defaultInicio);
  const [dataFim, setDataFim] = useState<string>(defaultFim);

  const [filtroInicio, setFiltroInicio] = useState<string>(defaultInicio);
  const [filtroFim, setFiltroFim] = useState<string>(defaultFim);

  const [dataSelecionadaQueimadas, setDataSelecionadaQueimadas] = useState<string | null>(null);
  const [dataSelecionadaDesmatamento, setDataSelecionadaDesmatamento] = useState<string | null>(null);
  const [isLoadingDayData, setIsLoadingDayData] = useState(false);

  const [queimadasRawData, setQueimadasRawData] = useState<Array<{ [key: string]: unknown }>>([]);
  const [desmatamentoRawData, setDesmatamentoRawData] = useState<Array<{ [key: string]: unknown }>>([]);

  const [sicarRawData, setSicarRawData] = useState<Array<{ [key: string]: unknown }>>([]);
  const [prodesRawData, setProdesRawData] = useState<Array<{ [key: string]: unknown }>>([]);
  const [tiRawData, setTiRawData] = useState<Array<{ [key: string]: unknown }>>([]);
  const [ucRawData, setUcRawData] = useState<Array<{ [key: string]: unknown }>>([]);
  const [quilombolasRawData, setQuilombolasRawData] = useState<Array<{ [key: string]: unknown }>>([]);

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await DashboardService.getStats();
      const rawStats = response.stats || response;
      setStats(rawStats);
      return rawStats;
    },
    refetchInterval: 30000,
  });

  const { isLoading: queimadasLoading } = useQuery({
    queryKey: ["dashboard-queimadas", filtroInicio, filtroFim],
    queryFn: async () => {
      const data = await DashboardService.getQueimadas(50000, filtroInicio, filtroFim);

      if (Array.isArray(data)) {
        const filtered = data.filter((item) => {
          const date = String(item.data_hora || "").slice(0, 10);
          return date >= filtroInicio && date <= filtroFim;
        });

        setQueimadasRawData(filtered);
        setQueimadas(processTimeSeriesData(filtered, "data_hora", true));
      }

      return data;
    },
  });

  const { isLoading: desmatamentoLoading } = useQuery({
    queryKey: ["dashboard-desmatamento", filtroInicio, filtroFim, prodesRawData.length],
    queryFn: async () => {
      const data = await DashboardService.getDesmatamento(filtroInicio, filtroFim);

      if (Array.isArray(data)) {
        const filteredDeter = data.filter((item) => {
          const date = String(item.data_avistamento || "").slice(0, 10);
          return date >= filtroInicio && date <= filtroFim;
        });

        setDesmatamentoRawData(filteredDeter);

        const combined = [
          ...filteredDeter.map(d => ({ ...d, _date: d.data_avistamento })),
          ...prodesRawData.map(p => ({ ...p, _date: p.data_imagem }))
        ];

        setDesmatamento(processTimeSeriesData(combined, "_date", true));
      }

      return data;
    },
    refetchInterval: 60000,
  });

  const { isLoading: sicarLoading } = useQuery({
    queryKey: ["dashboard-sicar"],
    queryFn: async () => {
      const data = (await DashboardService.getSicar?.()) || [];
      if (Array.isArray(data)) setSicarRawData(data);
      return data;
    },
  });

  const { isLoading: prodesLoading } = useQuery({
    queryKey: ["dashboard-prodes", filtroInicio, filtroFim],
    queryFn: async () => {
      const data = (await DashboardService.getProdes?.(filtroInicio, filtroFim)) || [];
      if (Array.isArray(data)) {
        const filtered = data.filter((item) => {
          const date = String(item.data_imagem || "").slice(0, 10);
          return date >= filtroInicio && date <= filtroFim;
        });
        setProdesRawData(filtered);
      }
      return data;
    },
  });

  const { isLoading: tiLoading } = useQuery({
    queryKey: ["ti"],
    queryFn: async () => {
      const data = await DashboardService.getTerrasIndigenas();
      const list = Array.isArray(data) ? data : (data as Record<string, unknown>)?.data || [];
      if (Array.isArray(list)) setTiRawData(list);
      return list;
    },
  });

  const { isLoading: ucLoading } = useQuery({
    queryKey: ["uc"],
    queryFn: async () => {
      const data = await DashboardService.getUnidadesConservacao();
      const list = Array.isArray(data) ? data : (data as Record<string, unknown>)?.data || [];
      if (Array.isArray(list)) setUcRawData(list);
      return list;
    },
  });

  const { isLoading: quilombolasLoading } = useQuery({
    queryKey: ["quilombolas"],
    queryFn: async () => {
      const data = await DashboardService.getQuilombolas();
      const list = Array.isArray(data) ? data : (data as Record<string, unknown>)?.data || [];
      if (Array.isArray(list)) setQuilombolasRawData(list);
      return list;
    },
  });

  const isLoading =
    statsLoading ||
    queimadasLoading ||
    desmatamentoLoading ||
    sicarLoading ||
    prodesLoading ||
    tiLoading ||
    ucLoading ||
    quilombolasLoading;

  const handleFilterApply = () => {
    setFiltroInicio(dataInicio);
    setFiltroFim(dataFim);
  };

  const handleClearFilters = () => {
    setDataInicio(defaultInicio);
    setDataFim(defaultFim);
    setFiltroInicio(defaultInicio);
    setFiltroFim(defaultFim);
    setDataSelecionadaQueimadas(null);
    setDataSelecionadaDesmatamento(null);
  };

  const converterDataFormatada = (dataFormatada: string): string => {
    if (dataFormatada === "Sem data") return "Sem data";

    const [dia, mes, ano] = dataFormatada.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const geocodificarMunicipio = async (municipio: string): Promise<[number, number] | null> => {
    try {
      const query = `${municipio}, São Paulo, Brasil`;

      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=br&limit=1`,
        { headers: { "User-Agent": "VisionaGeoQuery/1.0" } }
      );

      const data = await resp.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch {
      return null;
    }

    return null;
  };

  const handleSelectDataQueimadas = async (dataFormatada: string): Promise<void> => {
    const isoDate = converterDataFormatada(dataFormatada);

    setDataSelecionadaQueimadas(isoDate);
    setIsLoadingDayData(true);

    let queimadasDia: Array<{ [key: string]: unknown }> = [];

    try {
      const data = await DashboardService.getQueimadas(50000, isoDate, isoDate);

      if (Array.isArray(data) && data.length > 0) {
        queimadasDia = data;
      } else {
        queimadasDia = queimadasRawData.filter(
          (item) => String(item.data_hora ?? "").slice(0, 10) === isoDate
        );
      }
    } catch {
      queimadasDia = queimadasRawData.filter(
        (item) => String(item.data_hora ?? "").slice(0, 10) === isoDate
      );
    }

    const filtro = {
      queimadasDia,
      desmatamentoDia: [],
      sicarDia: [],
      prodesDia: [],
    };

    setDaySelection(isoDate, filtro);
    setIsLoadingDayData(false);
  };

  const handleSelectDataDesmatamento = async (dataFormatada: string): Promise<void> => {
    const isoDate = converterDataFormatada(dataFormatada);

    setDataSelecionadaDesmatamento(isoDate);
    setIsLoadingDayData(true);

    let desmatamentoDia: Array<{ [key: string]: unknown }> = [];

    try {
      const data = await DashboardService.getDesmatamento(isoDate, isoDate);

      if (Array.isArray(data) && data.length > 0) {
        desmatamentoDia = data;
      } else {
        desmatamentoDia = desmatamentoRawData.filter(
          (item) => String(item.data_avistamento ?? "").slice(0, 10) === isoDate
        );
      }
    } catch {
      desmatamentoDia = desmatamentoRawData.filter(
        (item) => String(item.data_avistamento ?? "").slice(0, 10) === isoDate
      );
    }

    const municipiosUnicos = Array.from(
      new Set(desmatamentoDia.map((item) => String(item.municipio ?? "")).filter(Boolean))
    );

    const coordsMap: Record<string, [number, number]> = {};

    await Promise.all(
      municipiosUnicos.map(async (municipio) => {
        const coords = await geocodificarMunicipio(municipio);
        if (coords) coordsMap[municipio] = coords;
      })
    );

    const desmatamentoDiaComCoords = desmatamentoDia.map((item) => {
      const municipio = String(item.municipio ?? "");
      const coords = coordsMap[municipio];

      return coords ? { ...item, latitude: coords[0], longitude: coords[1] } : item;
    });

    const prodesDia = prodesRawData.filter(
      (item) => String(item.data_imagem ?? "").slice(0, 10) === isoDate
    );

    const filtro = {
      queimadasDia: [],
      desmatamentoDia: desmatamentoDiaComCoords,
      sicarDia: [],
      prodesDia,
    };

    setDaySelection(isoDate, filtro);
    setIsLoadingDayData(false);
  };

  const displayStats = useMemo(() => {
    return {
      corpus_asg: stats?.corpus_asg || 0,
      queimadas: queimadasRawData.length,
      desmatamento_alertas: desmatamentoRawData.length + prodesRawData.length,
      terras_indigenas: stats?.terras_indigenas || tiRawData.length || 0,
      unidades_conservacao: stats?.unidades_conservacao || ucRawData.length || 0,
      comunidades_quilombolas: stats?.comunidades_quilombolas || quilombolasRawData.length || 0,
      prodes_desmatamento: stats?.prodes_desmatamento || prodesRawData.length || 0,
      sicar_imoveis: stats?.sicar_imoveis || sicarRawData.length || 0,
    };
  }, [
    stats,
    queimadasRawData,
    desmatamentoRawData,
    tiRawData,
    ucRawData,
    quilombolasRawData,
    prodesRawData,
    sicarRawData,
      ]);

  return {
    isLoading,
    displayStats,
    queimadas,
    desmatamento,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    handleFilterApply,
    handleClearFilters,
    isLoadingDayData,
    dataSelecionadaQueimadas,
    dataSelecionadaDesmatamento,
    handleSelectDataQueimadas,
    handleSelectDataDesmatamento,
  };
}