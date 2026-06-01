"use client";

import { IGeoJSONFeatureCollection } from "@/interfaces/geojson";
import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";

interface Props {
  preview: {
    data: IGeoJSONFeatureCollection;
    tempoMs: number;
    tamanhoBytes: number;
  } | null;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function PreviewStats({ preview }: Props) {
  if (!preview) return null;
  const { data, tempoMs, tamanhoBytes } = preview;
  const total = data.features?.length ?? 0;

  const items: Array<{ icon: IconName; label: string; value: string }> = [
    { icon: "data", label: "Features", value: total.toLocaleString("pt-BR") },
    { icon: "clock", label: "Tempo", value: `${tempoMs} ms` },
    { icon: "download", label: "Tamanho", value: formatBytes(tamanhoBytes) },
  ];

  return (
    <div className="absolute top-4 left-4 z-1000 flex gap-2 animate-pop-in">
      {items.map((it) => (
        <div
          key={it.label}
          className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
        >
          <Icon name={it.icon} size={14} className="text-white/70" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-medium text-white/60 tracking-wider">
              {it.label}
            </span>
            <span className="text-sm font-bold text-white mt-0.5">{it.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
