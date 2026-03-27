/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import Icon from "../Icon";
import { GeoJSONFeatureCollection } from "@/interfaces/geojson";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface Props {
  onSuggestionClick: (text: string) => void;
  geoJsonData?: GeoJSONFeatureCollection | null;
  intention?: string | null;
}

export default function Map({ onSuggestionClick, geoJsonData, intention }: Props) {
  const suggestions = [
    "Qual a situação ambiental de Guarulhos?",
    "Quais terras indígenas existem em Ubatuba?",
    "Unidades de conservação em São Paulo",
    "Comunidades quilombolas em Eldorado",
  ];

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
