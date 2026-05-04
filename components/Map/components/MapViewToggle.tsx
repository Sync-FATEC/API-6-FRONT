"use client";

import Icon from "../../Icon";
import { IconName } from "../../Icon/IconName";
import * as MapConfig from "@/constants/map";
import Tooltip from "@/components/Tooltip";

interface Props {
  activeType: MapConfig.TMapProvider;
  onChange: (type: MapConfig.TMapProvider) => void;
}

export default function MapViewToggle({ activeType, onChange }: Props) {
  const botoes = [
    {
      id: "street" as const,
      icon: "gps" as IconName,
      tooltip: "Mapa padrão",
    },
    {
      id: "satellite" as const,
      icon: "satellite" as IconName,
      tooltip: "Imagem de satélite",
    },
  ];

  const baseClasses =
    "relative z-10 p-2.5 rounded-2xl transition-colors duration-300 flex items-center justify-center cursor-pointer w-11 h-11";

  return (
    <div className="absolute top-4 right-4 z-1000 bg-black/50 p-1 rounded-[20px] backdrop-blur-sm flex items-center shadow-lg gap-1">
      <div
        className="absolute h-11 w-11 bg-white rounded-2xl shadow-sm transition-all duration-300 ease-in-out"
        style={{
          transform: activeType === "street" ? "translateX(0px)" : "translateX(48px)",
        }}
      />

      {botoes.map((botao) => {
        const isActive = activeType === botao.id;

        return (
          <Tooltip key={botao.id} content={botao.tooltip}>
            <button
              onClick={() => onChange(botao.id)}
              className={`${baseClasses} ${
                isActive ? "text-primary" : "text-white hover:bg-white/10"
              }`}
            >
              <Icon name={botao.icon} size={24} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
