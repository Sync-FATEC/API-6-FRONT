"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";

const PASSOS = [
  "Abra o QGIS no seu computador.",
  "Layer → Add Layer → Add Vector Layer (Ctrl+Shift+V).",
  "Source Type: Protocol: HTTP(S), cloud, etc.",
  "Protocol Type: GeoJSON.",
  "Cole a URL copiada no campo URI.",
  "Clique em Add e depois Close.",
];

export default function QgisInstructions() {
  const [aberto, setAberto] = useState(false);

  return (
    <section className="flex flex-col gap-2">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2.5 hover:border-primary-200 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon name="info" size={14} className="text-primary" />
          <span className="text-xs font-semibold text-slate-700">Como usar no QGIS</span>
        </div>
        <Icon
          name="chevron-down"
          size={14}
          className={cn("text-slate-400 transition-transform", aberto && "rotate-180")}
        />
      </button>

      {aberto && (
        <ol className="flex flex-col gap-1.5 px-1 py-2 animate-pop-in-up">
          {PASSOS.map((passo, idx) => (
            <li key={idx} className="flex gap-2 items-start">
              <span className="shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white font-bold text-[9px] mt-0.5">
                {idx + 1}
              </span>
              <span className="text-[11px] text-slate-600 leading-snug">{passo}</span>
            </li>
          ))}
          <li className="mt-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-1.5">
            <p className="text-[10px] text-amber-800">
              <strong>EPSG:4326</strong> — combine com basemaps OSM/Satélite sem reprojetar.
            </p>
          </li>
        </ol>
      )}
    </section>
  );
}
