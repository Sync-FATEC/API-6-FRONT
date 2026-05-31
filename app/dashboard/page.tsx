"use client";

import StatCard from "@/components/Dashboard/StatCard";
import TimeSeriesChart from "@/components/Dashboard/TimeSeriesChart";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useDashboard } from "./useDashboard";
import DateTimePicker from "@/components/Inputs/DateTimePicker";
import { formatToYYYYMMDD } from "@/helpers/dashboard";
import { Button } from "@/components/Button";
import { IconName } from "@/components/Icon/IconName";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDaySelection } from "@/contexts/DaySelectionContext";

export default function DashboardPage() {
  const router = useRouter();
  const {} = useDaySelection();
  const {
    isLoading,
    displayStats,
    queimadas,
    desmatamento,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    handleFilterApply,

    isLoadingDayData,
    dataSelecionadaQueimadas,
    dataSelecionadaDesmatamento,
    handleSelectDataQueimadas,
    handleSelectDataDesmatamento,
  } = useDashboard();

  const handleMapNavigateQueimadas = async (dataFormatada: string) => {
    await handleSelectDataQueimadas(dataFormatada);
    router.push("/");
  };

  const handleMapNavigateDesmatamento = async (dataFormatada: string) => {
    await handleSelectDataDesmatamento(dataFormatada);
    router.push("/");
  };

  const statCardsConfig = [
    {
      id: "sicar_imoveis",
      title: "Imóveis rurais",
      value: displayStats.sicar_imoveis,
      color: "sicar" as const,
      icon: "farm" as IconName,
    },
    {
      id: "queimadas",
      title: "Queimadas Detectadas",
      value: displayStats.queimadas,
      color: "queimadas" as const,
      icon: "flame" as IconName,
    },
    {
      id: "desmatamento",
      title: "Alertas de Desmatamento",
      value: displayStats.desmatamento_alertas,
      color: "deter" as const,
      icon: "axe" as IconName,
    },
    {
      id: "terras_indigenas",
      title: "Terras Indígenas",
      value: displayStats.terras_indigenas,
      color: "funai" as const,
      icon: "leaf" as IconName,
    },
    {
      id: "unidades_conservacao",
      title: "Unidades de Conservação",
      value: displayStats.unidades_conservacao,
      color: "icmbio" as const,
      icon: "shield" as IconName,
    },
    {
      id: "comunidades_quilombolas",
      title: "Comunidades Quilombolas",
      value: displayStats.comunidades_quilombolas,
      color: "palmares" as const,
      icon: "fist" as IconName,
    },
  ];

  const dataOntem = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  return (
    <div className="flex flex-col gap-6 flex-1 w-3/4 mx-auto py-12">
      <h1 className="text-primary text-4xl font-bold">Dashboard</h1>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statCardsConfig
              .filter((card) =>
                [
                  "sicar_imoveis",
                  "terras_indigenas",
                  "unidades_conservacao",
                  "comunidades_quilombolas",
                ].includes(card.id)
              )
              .map((card) => (
                <StatCard
                  key={card.id}
                  title={card.title}
                  icon={card.icon}
                  value={card.value || 0}
                  color={card.color}
                />
              ))}
          </div>

          <h4 className="text-2xl font-bold text-primary mt-8 -mb-2">Dados de queimadas</h4>

          <div className="flex bg-white items-end gap-5 rounded-lg p-6 shadow-sm justify-between">
            <div className="flex gap-4">
              <DateTimePicker
                label="Data Inicial"
                id="data-inicio"
                includeTime={false}
                value={dataInicio ? new Date(`${dataInicio}T00:00:00`) : undefined}
                onChange={(date: Date) => setDataInicio(formatToYYYYMMDD(date))}
                maxDate={dataOntem}
                wrapperClassName="flex-1"
                className="w-full"
              />

              <DateTimePicker
                label="Data Final"
                id="data-fim"
                includeTime={false}
                value={dataFim ? new Date(`${dataFim}T00:00:00`) : undefined}
                onChange={(date: Date) => setDataFim(formatToYYYYMMDD(date))}
                wrapperClassName="flex-1"
                minDate={dataInicio ? new Date(`${dataInicio}T00:00:00`) : undefined}
                className="w-full"
              />
            </div>

            <Button onClick={handleFilterApply} isLoading={isLoading}>
              Aplicar Filtros
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 relative">
            {isLoadingDayData && (
              <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg gap-2">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-600 font-medium">Buscando dados do dia...</p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <StatCard
                title="Queimadas Detectadas"
                icon="flame"
                value={displayStats.queimadas || 0}
                color="queimadas"
              />

              <TimeSeriesChart
                title="Queimadas por Data"
                data={queimadas}
                dataKeyValue="quantidade"
                dataKeyLabel="data"
                type="line"
                color="#f97316"
                onDataPointClick={handleMapNavigateQueimadas}
                selectedData={dataSelecionadaQueimadas}
              />
            </div>

            <div className="flex flex-col gap-5">
              <StatCard
                title="Alertas de Desmatamento"
                icon="axe"
                value={displayStats.desmatamento_alertas || 0}
                color="deter"
              />

              <TimeSeriesChart
                title="Desmatamento por Data"
                data={desmatamento}
                dataKeyValue="quantidade"
                dataKeyLabel="data"
                type="line"
                color="#f97316"
                onDataPointClick={handleMapNavigateDesmatamento}
                selectedData={dataSelecionadaDesmatamento}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
