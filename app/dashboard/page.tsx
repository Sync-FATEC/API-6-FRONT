"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/Dashboard/StatCard";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import TimeSeriesChart from "@/components/Dashboard/TimeSeriesChart";
import { DashboardService } from "@/services/DashboardService";
import { IDashboardStats } from "@/interfaces/services/DashboardService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Icon from "@/components/Icon";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [queimadas, setQueimadas] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [desmatamento, setDesmatamento] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [filteredStats, setFilteredStats] = useState<IDashboardStats | null>(null);
  const [dataInicio, setDataInicio] = useState<string>("2026-01-01");
  const [dataFim, setDataFim] = useState<string>("");

  // Fetch stats data
  const { isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await DashboardService.getStats();
      setStats(response.stats || response);
      return response;
    },
    refetchInterval: 30000, 
  });

  const { isLoading: queimadasLoading, refetch: refetchQueimadas } = useQuery({
    queryKey: ["dashboard-queimadas", dataInicio, dataFim],
    queryFn: async () => {
      const data = await DashboardService.getQueimadas(50000, dataInicio, dataFim);
      if (Array.isArray(data)) {
        const hasFilter = !!dataFim; // Filtro ativo só quando dataFim está preenchido
        const processed = processTimeSeriesData(data, "data_hora", hasFilter);
        setQueimadas(processed);
        
        if (hasFilter) {
          setFilteredStats((prev) => ({
            corpus_asg: prev?.corpus_asg ?? stats?.corpus_asg ?? 0,
            queimadas: data.length,
            desmatamento_alertas: prev?.desmatamento_alertas ?? stats?.desmatamento_alertas ?? 0,
            terras_indigenas: prev?.terras_indigenas ?? stats?.terras_indigenas ?? 0,
            unidades_conservacao: prev?.unidades_conservacao ?? stats?.unidades_conservacao ?? 0,
            comunidades_quilombolas: prev?.comunidades_quilombolas ?? stats?.comunidades_quilombolas ?? 0,
            prodes_desmatamento: prev?.prodes_desmatamento ?? stats?.prodes_desmatamento ?? 0,
          }));
        }
      }
      return data;
    },
    refetchInterval: 60000, 
  });

  const { isLoading: desmatamentoLoading, refetch: refetchDesmatamento } = useQuery({
    queryKey: ["dashboard-desmatamento", dataInicio, dataFim],
    queryFn: async () => {
      const data = await DashboardService.getDesmatamento(dataInicio, dataFim);
      if (Array.isArray(data)) {
        const hasFilter = !!dataFim; // Filtro ativo só quando dataFim está preenchido
        const processed = processTimeSeriesData(data, "data_avistamento", hasFilter);
        setDesmatamento(processed);
        
        if (hasFilter) {
          setFilteredStats((prev) => ({
            corpus_asg: prev?.corpus_asg ?? stats?.corpus_asg ?? 0,
            queimadas: prev?.queimadas ?? stats?.queimadas ?? 0,
            desmatamento_alertas: data.length,
            terras_indigenas: prev?.terras_indigenas ?? stats?.terras_indigenas ?? 0,
            unidades_conservacao: prev?.unidades_conservacao ?? stats?.unidades_conservacao ?? 0,
            comunidades_quilombolas: prev?.comunidades_quilombolas ?? stats?.comunidades_quilombolas ?? 0,
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
    refetchQueimadas();
    refetchDesmatamento();
  };

  const handleRefreshAll = () => {
    refetchStats();
    refetchQueimadas();
    refetchDesmatamento();
    
    toast.success("Dados atualizados!", {
      description: "As informações foram sincronizadas com sucesso."
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const displayStats = {
    corpus_asg: stats?.corpus_asg || 0,
    queimadas: dataFim && filteredStats?.queimadas ? filteredStats.queimadas : (stats?.queimadas || 0),
    desmatamento_alertas: dataFim && filteredStats?.desmatamento_alertas ? filteredStats.desmatamento_alertas : (stats?.desmatamento_alertas || 0),
    terras_indigenas: stats?.terras_indigenas || 0, // Sem filtro de data
    unidades_conservacao: stats?.unidades_conservacao || 0, // Sem filtro de data
    comunidades_quilombolas: stats?.comunidades_quilombolas || 0, // Sem filtro de data
    prodes_desmatamento: stats?.prodes_desmatamento || 0,
  };

  const processTimeSeriesData = (data: Array<{ [key: string]: unknown }>, dateField: string, hasFilter: boolean = false): Array<{ data: string; quantidade: number }> => {
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      let dateStr = "Sem data";
      if (item[dateField]) {
        const dateObj = new Date(item[dateField] as string);
        dateStr = dateObj.toISOString().split('T')[0]; // "2026-04-21"
      }
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });

    const result = Object.entries(grouped)
      .map(([date, count]) => {
        if (date === "Sem data") {
          return { data: date, quantidade: count };
        }
        const [year, month, day] = date.split('-');
        const displayDate = `${day}/${month}/${year}`;
        return { data: displayDate, quantidade: count };
      })
      .sort((a, b) => {
        if (a.data === "Sem data") return 1;
        if (b.data === "Sem data") return -1;
        const [dayA, monthA, yearA] = a.data.split('/');
        const [dayB, monthB, yearB] = b.data.split('/');
        return new Date(`${yearA}-${monthA}-${dayA}`).getTime() - new Date(`${yearB}-${monthB}-${dayB}`).getTime();
      });

    // Se houver filtro, retorna todo o período selecionado
    return hasFilter ? result : result.slice(-50);
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-50 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Análise ambiental, social e governança - São Paulo</p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
          >
            <Icon name="refresh-cw" size={16} />
            Atualizar
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-end gap-4 p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Final</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleFilterApply}
            disabled={isLoading}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-600 disabled:opacity-50 font-medium"
          >
            Aplicar Filtro
          </button>
          {dataFim && (
            <button
              onClick={() => {
                setDataInicio("2026-01-01");
                setDataFim("");
                setFilteredStats(null);
                refetchQueimadas();
                refetchDesmatamento();
              }}
              className="rounded-lg bg-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-400 font-medium"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Propriedades Analisadas"
              value={displayStats?.corpus_asg || 0}
              color="blue"
              icon="📊"
              description="Registros no corpus ASG"
            />
            <StatCard
              title="Queimadas Detectadas"
              value={displayStats?.queimadas || 0}
              color="orange"
              icon="🔥"
              description="Focos de incêndio"
              trend="up"
            />
            <StatCard
              title="Alertas de Desmatamento"
              value={displayStats?.desmatamento_alertas || 0}
              color="red"
              icon="🌳"
              description="Áreas monitoradas"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Terras Indígenas"
              value={displayStats?.terras_indigenas || 0}
              color="purple"
              icon="🏛️"
              description="Áreas mapeadas"
            />
            <StatCard
              title="Unidades de Conservação"
              value={displayStats?.unidades_conservacao || 0}
              color="green"
              icon="🌲"
              description="Áreas protegidas"
            />
            <StatCard
              title="Comunidades Quilombolas"
              value={displayStats?.comunidades_quilombolas || 0}
              color="purple"
              icon="👥"
              description="Comunidades cadastradas"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title="Queimadas por Data"
              data={queimadas}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="line"
              color="#f97316"
            />
            <TimeSeriesChart
              title="Desmatamento por Data"
              data={desmatamento}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="line"
              color="#ef4444"
            />
          </div>

          <DashboardCard
            title="Sobre os Dados"
            subtitle="Última atualização e fontes de informação"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-600">PRODES (Desmatamento)</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{displayStats?.prodes_desmatamento || 0}</p>
                <p className="mt-1 text-xs text-slate-500">Registros monitorados</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-600">Total de Registros</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {displayStats
                    ? Object.values(displayStats).reduce((a: number, b: number | string) => a + (typeof b === "number" ? b : 0), 0)
                    : 0}
                </p>
                <p className="mt-1 text-xs text-slate-500">Em todas as fontes</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-600">Status do Sistema</p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-green-600">Operacional</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">Sincronizado em tempo real</p>
              </div>
            </div>
          </DashboardCard>
        </>
      )}
    </div>
  );
}
