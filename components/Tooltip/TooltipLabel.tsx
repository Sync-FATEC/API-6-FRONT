import Tooltip from "@/components/Tooltip";
import Icon from "@/components/Icon";
import { cn } from "@/utils/className";

interface Props {
  label: string;
  tip: string;
  className?: string;
}

export default function TooltipLabel({ label, tip, className }: Props) {

  return (
    <Tooltip content={tip}>
      <span className={cn("flex items-center gap-1.5 w-fit cursor-help", className)}>
        {label}
        <Icon name="info" size={14} className="text-inherit" />
      </span>
    </Tooltip>
  );
}
