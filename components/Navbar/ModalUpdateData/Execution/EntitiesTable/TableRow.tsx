import Checkbox from "@/components/Checkbox";
import { formatDateParts } from "@/utils/date";
import { PipelineSourceStatus } from "@/interfaces/services/PipelineService";

interface Props {
  label: string;
  source: string;
  checked: boolean;
  onToggle: () => void;
  info?: PipelineSourceStatus;
  isLast?: boolean;
}

export default function GeoEntitiesTableRow({
  label,
  source,
  checked,
  onToggle,
  info,
  isLast,
}: Props) {
  const formatted = formatDateParts(info?.ultima_atualizacao);

  return (
    <div
      onClick={onToggle}
      className={`grid items-center px-4 py-3 text-sm cursor-pointer hover:bg-slate-50 ${
        !isLast ? "border-b border-slate-200" : ""
      }`}
      style={{ gridTemplateColumns: "35% 25% 20% 20%" }}
    >
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} />
        <span className="font-medium text-slate-700">{label}</span>
      </div>

      <div className="flex items-center gap-1.5 text-slate-600">{source}</div>

      <div className="flex items-center gap-1.5 text-slate-600">
        {info?.contagem?.toLocaleString() ?? "N/A"}
      </div>

      <div className="flex items-center gap-1.5 text-slate-600">
        {formatted ? (
          <>
            <span>{formatted.date}</span>
            <span className="text-slate-400">{formatted.time}</span>
          </>
        ) : (
          "N/A"
        )}
      </div>
    </div>
  );
}
