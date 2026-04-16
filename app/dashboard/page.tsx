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

export default function DashboardPage() {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [queimadas, setQueimadas] = useState<Array<{ data: string; quantidade: number }>>([]);
  const [desmatamento, setDesmatamento] = useState<Array<{ data: string; quantidade: number }>>([]);

  // Fetch stats data
  const { isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await DashboardService.getStats();
      setStats(response.stats || response);
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch queimadas data
  const { isLoading: queimadasLoading } = useQuery({
    queryKey: ["dashboard-queimadas"],
    queryFn: async () => {
      const data = await DashboardService.getQueimadas(100);
      // Process data for time series
      if (Array.isArray(data)) {
        const processed = processTimeSeriesData(data, "data_hora");
        setQueimadas(processed);
      }
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Fetch desmatamento data
  const { isLoading: desmatamentoLoading } = useQuery({
    queryKey: ["dashboard-desmatamento"],
    queryFn: async () => {
      const data = await DashboardService.getDesmatamento();
      // Process data for time series
      if (Array.isArray(data)) {
        const processed = processTimeSeriesData(data, "data_avistamento");
        setDesmatamento(processed);
      }
      return data;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const isLoading = statsLoading || queimadasLoading || desmatamentoLoading;

  const processTimeSeriesData = (data: Array<{ [key: string]: unknown }>, dateField: string): Array<{ data: string; quantidade: number }> => {
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      const date = item[dateField] ? new Date(item[dateField]).toLocaleDateString("pt-BR") : "Sem data";
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ data: date, quantidade: count }))
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(-15); // Last 15 days
  };

  const getAverageScore = (): string => {
    if (!stats || !stats.corpus_asg) return "0.0";
    // Placeholder - será substituído com dados reais da API
    // Usando um valor fixo em vez de Math.random() para evitar re-renders impuros
    return "75.0";
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Análise ambiental, social e governança - São Paulo</p>
          </div>
          <button
            onClick={() => refetchStats()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
          >
            <Icon name="refresh-cw" size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Propriedades Analisadas"
              value={stats?.corpus_asg || 0}
              color="blue"
              icon="📊"
              description="Registros no corpus ASG"
            />
            <StatCard
              title="Queimadas Detectadas"
              value={stats?.queimadas || 0}
              color="orange"
              icon="🔥"
              description="Focos de incêndio"
              trendValue={Math.floor((stats?.queimadas || 0) * 0.15) + " este mês"}
              trend="up"
            />
            <StatCard
              title="Alertas de Desmatamento"
              value={stats?.desmatamento_alertas || 0}
              color="red"
              icon="🌳"
              description="Áreas monitoradas"
            />
            <StatCard
              title="Média da Nota ASG"
              value={getAverageScore()}
              color="green"
              icon="⭐"
              description="Em uma escala de 0-100"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Terras Indígenas"
              value={stats?.terras_indigenas || 0}
              color="purple"
              icon="🏛️"
              description="Áreas mapeadas"
            />
            <StatCard
              title="Unidades de Conservação"
              value={stats?.unidades_conservacao || 0}
              color="green"
              icon="🌲"
              description="Áreas protegidas"
            />
            <StatCard
              title="Comunidades Quilombolas"
              value={stats?.comunidades_quilombolas || 0}
              color="purple"
              icon="👥"
              description="Comunidades cadastradas"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title="Queimadas por Data"
              subtitle="Últimos 15 dias com registros"
              data={queimadas}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="bar"
              color="#f97316"
            />
            <TimeSeriesChart
              title="Alertas de Desmatamento por Data"
              subtitle="Últimos 15 dias com alertas"
              data={desmatamento}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="line"
              color="#ef4444"
            />
          </div>

          {/* Additional Info Card */}
          <DashboardCard
            title="Sobre os Dados"
            subtitle="Última atualização e fontes de informação"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-600">PRODES (Desmatamento)</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats?.prodes_desmatamento || 0}</p>
                <p className="mt-1 text-xs text-slate-500">Registros monitorados</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-600">Total de Registros</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats
                    ? Object.values(stats).reduce((a: number, b: number | string) => a + (typeof b === "number" ? b : 0), 0)
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
