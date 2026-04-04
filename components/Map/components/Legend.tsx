import { MAP_SOURCES } from "@/constants/map";

interface Props {
  activeSources: string[];
  availableSources: string[];
  onToggle: (source: string) => void;
}

export default function MapLegend({ activeSources, availableSources, onToggle }: Props) {
  if (availableSources.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-6 z-1000 bg-black/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg w-105">
      <h4 className="text-xs uppercase font-bold text-white mb-4 tracking-wider">Legenda</h4>

      <div className="flex flex-wrap gap-y-3 gap-x-6">
        {availableSources.map((source) => {
          const config = MAP_SOURCES[source] || MAP_SOURCES.desconhecida;
          const isActive = activeSources.includes(source);

          return (
            <button
              key={source}
              onClick={() => onToggle(source)}
              className={`flex items-center gap-2 transition-all cursor-pointer basis-[20%] w-fit min-w-max ${
                isActive ? "opacity-100" : "opacity-50 grayscale"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm font-semibold text-white whitespace-nowrap">
                {config.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
