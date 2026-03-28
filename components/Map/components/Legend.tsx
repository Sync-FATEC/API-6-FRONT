import { MAP_SOURCES } from "@/constants/map";

interface Props {
  activeSources: string[];
  availableSources: string[];
  onToggle: (source: string) => void;
}

export default function MapLegend({ activeSources, availableSources, onToggle }: Props) {
  if (availableSources.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-6 z-1000 bg-black/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
      <h4 className="text-xs uppercase font-bold text-white mb-4 tracking-wider">Legenda</h4>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,max-content))] gap-x-6 gap-y-2 max-w-100">
        {availableSources.map((source) => {
          const config = MAP_SOURCES[source] || MAP_SOURCES.desconhecida;
          const isActive = activeSources.includes(source);

          return (
            <button
              key={source}
              onClick={() => onToggle(source)}
              className={`flex items-center gap-2 transition-opacity cursor-pointer ${
                isActive ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm font-semibold text-white/80 truncate">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
