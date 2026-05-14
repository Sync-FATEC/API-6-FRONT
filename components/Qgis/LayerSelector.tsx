"use client";

import { IQgisLayer } from "@/interfaces/services/QgisService";
import { MAP_SOURCES } from "@/constants/map";
import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";
import { cn } from "@/utils/className";

interface Props {
  camadas: IQgisLayer[];
  selecionada: IQgisLayer | null;
  onSelect: (camada: IQgisLayer) => void;
}

const FONTE_PARA_KEY: Record<string, string> = {
  INPE: "queimadas",
  FUNAI: "funai",
  "DETER/INPE": "deter",
  "PRODES/INPE": "prodes",
  SICAR: "sicar",
  "ICMBio/MMA": "icmbio",
  "Fundacao Cultural Palmares": "palmares",
};

export default function LayerSelector({ camadas, selecionada, onSelect }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider px-0.5">
        Camadas
      </h3>
      <div className="flex flex-col gap-1.5">
        {camadas.map((camada) => {
          const key = FONTE_PARA_KEY[camada.fonte] ?? "desconhecida";
          const cfg = MAP_SOURCES[key] ?? MAP_SOURCES.desconhecida;
          const isActive = selecionada?.id === camada.id;
          const nomeCurto = camada.nome.replace(/\(.*?\)/g, "").trim();

          return (
            <button
              key={camada.id}
              onClick={() => onSelect(camada)}
              title={camada.descricao}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition cursor-pointer",
                isActive
                  ? "border-primary bg-primary-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50",
              )}
            >
              <span
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: cfg.color }}
              >
                <Icon name={cfg.icon as IconName} size={16} />
              </span>
              <span
                className={cn(
                  "text-xs font-semibold leading-tight line-clamp-1 flex-1",
                  isActive ? "text-primary" : "text-slate-700",
                )}
              >
                {nomeCurto}
              </span>
              {isActive && (
                <Icon name="check" size={14} className="text-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
