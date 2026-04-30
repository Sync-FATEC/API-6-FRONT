import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/DashboardService";
import { IDashboardStats } from "@/interfaces/services/DashboardService";

const processTimeSeriesData = (
  data: Array<{ [key: string]: unknown }>,
  dateField: string,
  hasFilter: boolean = false
): Array<{ data: string; quantidade: number }> => {
  const grouped: Record<string, number> = {};

  data.forEach((item) => {
    let dateStr = "Sem data";
    if (item[dateField]) {
      const dateObj = new Date(item[dateField] as string);
      dateStr = dateObj.toISOString().split("T")[0];
    }
    grouped[dateStr] = (grouped[dateStr] || 0) + 1;
  });

  const result = Object.entries(grouped)
    .map(([date, count]) => {
      if (date === "Sem data") {
        return { data: date, quantidade: count };
      }
      const [year, month, day] = date.split("-");
      const displayDate = `${day}/${month}/${year}`;
      return { data: displayDate, quantidade: count };
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
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [queimadas, setQueimadas] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [desmatamento, setDesmatamento] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [filteredStats, setFilteredStats] = useState<IDashboardStats | null>(null);

  const [dataInicio, setDataInicio] = useState<string>("2026-01-01");
  const [dataFim, setDataFim] = useState<string>("");

  const [filtroInicio, setFiltroInicio] = useState<string>("2026-01-01");
  const [filtroFim, setFiltroFim] = useState<string>("");

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
        const hasFilter = !!filtroInicio || !!filtroFim;
        setQueimadas(processTimeSeriesData(data, "data_hora", hasFilter));

        if (hasFilter) {
          setFilteredStats((prev) => ({
            corpus_asg: prev?.corpus_asg ?? stats?.corpus_asg ?? 0,
            queimadas: data.length,
            desmatamento_alertas: prev?.desmatamento_alertas ?? stats?.desmatamento_alertas ?? 0,
            terras_indigenas: prev?.terras_indigenas ?? stats?.terras_indigenas ?? 0,
            unidades_conservacao: prev?.unidades_conservacao ?? stats?.unidades_conservacao ?? 0,
            comunidades_quilombolas:
              prev?.comunidades_quilombolas ?? stats?.comunidades_quilombolas ?? 0,
            prodes_desmatamento: prev?.prodes_desmatamento ?? stats?.prodes_desmatamento ?? 0,
          }));
        }
      }
      return data;
    },
  });

  const { isLoading: desmatamentoLoading } = useQuery({
    queryKey: ["dashboard-desmatamento", filtroInicio, filtroFim],
    queryFn: async () => {
      const data = await DashboardService.getDesmatamento(filtroInicio, filtroFim);
      if (Array.isArray(data)) {
        const hasFilter = !!filtroFim;
        setDesmatamento(processTimeSeriesData(data, "data_avistamento", hasFilter));

        if (hasFilter) {
          setFilteredStats((prev) => ({
            corpus_asg: prev?.corpus_asg ?? stats?.corpus_asg ?? 0,
            queimadas: prev?.queimadas ?? stats?.queimadas ?? 0,
            desmatamento_alertas: data.length,
            terras_indigenas: prev?.terras_indigenas ?? stats?.terras_indigenas ?? 0,
            unidades_conservacao: prev?.unidades_conservacao ?? stats?.unidades_conservacao ?? 0,
            comunidades_quilombolas:
              prev?.comunidades_quilombolas ?? stats?.comunidades_quilombolas ?? 0,
            prodes_desmatamento: prev?.prodes_desmatamento ?? stats?.prodes_desmatamento ?? 0,
          }));
        }
      }
      return data;
    },
    refetchInterval: 60000,
  });

  const isLoading = statsLoading || queimadasLoading || desmatamentoLoading;

  const handleFilterApply = () => {
    setFiltroInicio(dataInicio);
    setFiltroFim(dataFim);
  };

  const handleClearFilters = () => {
    const defaultInicio = "2026-01-01";
    const defaultFim = "";

    setDataInicio(defaultInicio);
    setDataFim(defaultFim);
    setFiltroInicio(defaultInicio);
    setFiltroFim(defaultFim);

    setFilteredStats(null);
  };

  const displayStats = useMemo(() => {
    const active = !!filtroFim;
    return {
      corpus_asg: stats?.corpus_asg || 0,
      queimadas: active ? (filteredStats?.queimadas ?? 0) : stats?.queimadas || 0,
      desmatamento_alertas: active
        ? (filteredStats?.desmatamento_alertas ?? 0)
        : stats?.desmatamento_alertas || 0,
      terras_indigenas: stats?.terras_indigenas || 0,
      unidades_conservacao: stats?.unidades_conservacao || 0,
      comunidades_quilombolas: stats?.comunidades_quilombolas || 0,
      prodes_desmatamento: stats?.prodes_desmatamento || 0,
      sicar_imoveis: stats?.sicar_imoveis || 0,
    };
  }, [stats, filteredStats, filtroFim]);

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
  };
}
