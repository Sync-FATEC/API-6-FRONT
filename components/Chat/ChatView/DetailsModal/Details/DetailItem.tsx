import { cn } from "@/utils/className";
import TooltipLabel from "@/components/Tooltip/TooltipLabel";

interface DetailItemProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  tooltip?: string;
  colorValue?: string;
}

export function DetailItem({ label, value, tooltip, colorValue }: DetailItemProps) {
  if (!value) return null;

  return (
    <div className="flex justify-between items-center gap-4 text-sm">
      {tooltip ? (
        <TooltipLabel label={label} tip={tooltip} className="text-sm text-slate-500 font-medium" />
      ) : (
        <span className="text-slate-500 font-medium flex items-center gap-1.5">{label}</span>
      )}

      <span className={cn("text-slate-700 text-right", colorValue)}>{value}</span>
    </div>
  );
}