"use client";

import StatCard from "@/components/Dashboard/StatCard";
import TimeSeriesChart from "@/components/Dashboard/TimeSeriesChart";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Icon from "@/components/Icon";
import { useDashboard } from "./useDashboard";
import DateTimePicker from "@/components/Inputs/DateTimePicker";
import { formatToYYYYMMDD } from "@/helpers/dashboard";
import { Button } from "@/components/Button";
import { IconName } from "@/components/Icon/IconName";
import { useMemo } from "react";

export default function DashboardPage() {
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
    handleClearFilters,
  } = useDashboard();

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
      value: displayStats.prodes_desmatamento,
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

  const DEFAULT_DATA_INICIO = "2026-01-01";
  const DEFAULT_DATA_FIM = "";
  const hasActiveFilters = dataInicio !== DEFAULT_DATA_INICIO || dataFim !== DEFAULT_DATA_FIM;

  return (
    <div className="flex flex-col gap-6 flex-1 w-5/6 mx-auto my-12">
      <h1 className="text-primary text-5xl font-bold">Dashboard</h1>
      <div className="flex bg-white items-end gap-5 rounded-lg p-6 shadow-sm h-full justify-between">
        <div className="flex w-2/6 gap-4">
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

        <div className="flex gap-4">
          {hasActiveFilters && (
            <Button variant="soft" color="danger" onClick={handleClearFilters}>
              <Icon name="trash" />
              Limpar filtros
            </Button>
          )}

          <Button onClick={handleFilterApply} isLoading={isLoading}>
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {statCardsConfig.map((card) => (
              <StatCard
                key={card.id}
                title={card.title}
                icon={card.icon}
                value={card.value || 0}
                color={card.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TimeSeriesChart
              title="Queimadas por Data"
              data={queimadas}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="line"
              color="#f97316"
              smooth
            />
            <TimeSeriesChart
              title="Desmatamento por Data"
              data={desmatamento}
              dataKeyValue="quantidade"
              dataKeyLabel="data"
              type="line"
              color="#f97316"
            />
          </div>
        </>
      )}
    </div>
  );
}
