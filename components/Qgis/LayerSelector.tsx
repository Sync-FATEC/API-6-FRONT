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
    <section className="flex flex-col gap-4">
      <h3 className="font-medium text-slate-400">Selecione uma entidade</h3>
      <div className="flex flex-col gap-4">
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
                "group flex items-center gap-4 rounded-lg p-1 text-left cursor-pointer",
                isActive ? "" : "bg-white hover:bg-slate-100"
              )}
              style={isActive ? { backgroundColor: cfg.color } : {}}
            >
              <span
                className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-md"
                style={
                  isActive
                    ? { backgroundColor: "#ffffff", color: cfg.color }
                    : { backgroundColor: cfg.color, color: "#ffffff" }
                }
              >
                <Icon name={cfg.icon as IconName} />
              </span>
              <span
                className={cn(
                  "text-sm font-semibold leading-tight line-clamp-1 flex-1",
                  isActive ? "text-white" : "text-slate-600"
                )}
              >
                {nomeCurto}
              </span>
              {isActive && <Icon name="check" size={20} className="text-white shrink-0 mr-4" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
