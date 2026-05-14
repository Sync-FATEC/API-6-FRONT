"use client";

interface Props {
  camadaNome?: string | null;
}

export default function QgisHeader({ camadaNome }: Props) {
  return (
    <div className="flex flex-col gap-1 shrink-0">
      <h2 className="text-primary text-xl font-semibold leading-none">
        Integração QGIS
      </h2>
      <p className="text-slate-400 text-xs font-medium truncate">
        {camadaNome ?? "GeoJSON em EPSG:4326 prontos para o QGIS"}
      </p>
    </div>
  );
}
