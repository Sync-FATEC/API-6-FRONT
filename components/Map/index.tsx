/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import Icon from "../Icon";
import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import { useDaySelection } from "@/contexts/DaySelectionContext";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface Props {
  onSuggestionClick: (text: string) => void;
  geoJsonData?: IGeoJSONFeatureCollection | null;
  intention?: string | null;
  onPointClick?: (text: string) => void;
}

export default function Map({ onSuggestionClick, geoJsonData, intention, onPointClick }: Props) {
  const { dataSelecionada, filtroMapaDia, clearDaySelection } = useDaySelection();

  const suggestions = [
    "Qual a situação ambiental de Ubatuba?",
    "Quais terras indígenas existem em Osasco?",
    "Imóveis rurais em Campinas",
    "Comunidades quilombolas em Eldorado",
  ];

  if (dataSelecionada) {
    const dataFormatada = dataSelecionada.includes("-")
      ? dataSelecionada.split("-").reverse().join("/")
      : dataSelecionada;

    const queimadasCount = filtroMapaDia.queimadasDia?.length || 0;
    const desmatamentoCount = filtroMapaDia.desmatamentoDia?.length || 0;
    const sicarCount = filtroMapaDia.sicarDia?.length || 0;
    const prodesCount = filtroMapaDia.prodesDia?.length || 0;
    const totalDados = queimadasCount + desmatamentoCount + sicarCount + prodesCount;

    return (
      <div className="bg-white rounded-lg shadow-sm h-full w-full relative flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg text-slate-700">
              Mapa do dia {dataFormatada}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({totalDados} registro{totalDados !== 1 ? "s" : ""} no total)
              </span>
            </h2>
            <p className="text-sm text-slate-500">
              {queimadasCount > 0 && <span className="mr-3">🔥 {queimadasCount} queimada{queimadasCount !== 1 ? "s" : ""}</span>}
              {desmatamentoCount > 0 && <span className="mr-3">🌳 {desmatamentoCount} desmatamento{desmatamentoCount !== 1 ? "s" : ""}</span>}
              {sicarCount > 0 && <span className="mr-3">🏡 {sicarCount} imóve{sicarCount !== 1 ? "is" : "l"} SICAR</span>}
              {prodesCount > 0 && <span className="mr-3">📡 {prodesCount} PRODES</span>}
              {totalDados === 0 && <span className="text-amber-500">Nenhum dado com coordenadas encontrado para este dia</span>}
            </p>
          </div>
          <button
            onClick={clearDaySelection}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded text-sm font-medium transition"
          >
            Fechar
          </button>
        </div>
        <div className="flex-1">
          <LeafletMap
            geoJsonData={geoJsonData || { type: "FeatureCollection", features: [] }}
            intention={intention ?? null}
            dayFilter={filtroMapaDia}
            dataSelecionada={dataSelecionada}
            onPointClick={onPointClick}
          />
        </div>
      </div>
    );
  }

  if (geoJsonData) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-full w-full relative">
        <LeafletMap geoJsonData={geoJsonData} intention={intention ?? null} />
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-lg p-6 shadow-sm h-full justify-center items-center">
      <div className="flex flex-col gap-4 max-w-3xl w-full">
        <img src="/paper.svg" alt="Ilustração de papel" className="w-48" />
        <h3 className="font-semibold text-2xl text-slate-600">Nenhuma análise gerada ainda</h3>
        <p className="text-[18px] font-medium text-slate-500">
          Use linguagem natural para consultar dados geoespaciais e gerar relatórios ambientais
          automaticamente.
        </p>
        <p className="font-semibold text-[18px] text-slate-600 mt-4">Ideias de perguntas</p>
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestionClick(text)}
              className="flex gap-2 items-center text-slate-500 hover:text-primary transition cursor-pointer text-left"
            >
              <Icon name="arrow-right" size={20} />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
