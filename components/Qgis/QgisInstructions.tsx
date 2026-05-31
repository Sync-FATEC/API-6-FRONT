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
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon name="info" size={18} className="text-primary" />
          <span className="text-sm font-semibold text-slate-700">Como usar no QGIS</span>
        </div>

        <Icon
          name="chevron-down"
          size={14}
          className={cn("text-slate-400 transition-transform", aberto && "rotate-180")}
        />
      </button>

      {aberto && (
        <div className="border-t border-slate-200 px-3 py-3">
          <ol className="flex flex-col gap-3">
            {PASSOS.map((passo, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="shrink-0 inline-flex w-8 px-2 items-center justify-center rounded-xs bg-primary text-white font-bold text-sm ">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-slate-600 leading-snug">{passo}</span>
              </li>
            ))}
          </ol>


        </div>
      )}
    </section>
  );
}
