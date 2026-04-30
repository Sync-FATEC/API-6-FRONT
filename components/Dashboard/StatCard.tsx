import { cn } from "@/utils/className";
import Icon from "@/components/Icon";
import { IconName } from "../Icon/IconName";

const colorMap = {
  queimadas: { bg: "bg-[#ff4444]", border: "border-l-[#ff4444]", text: "text-[#ff4444]" },
  deter: { bg: "bg-[#f06400]", border: "border-l-[#f06400]", text: "text-[#f06400]" },
  prodes: { bg: "bg-[#f77f00]", border: "border-l-[#f77f00]", text: "text-[#f77f00]" },
  funai: { bg: "bg-[#55a630]", border: "border-l-[#55a630]", text: "text-[#55a630]" },
  icmbio: { bg: "bg-[#9d4edd]", border: "border-l-[#9d4edd]", text: "text-[#9d4edd]" },
  palmares: { bg: "bg-[#7A360F]", border: "border-l-[#7A360F]", text: "text-[#7A360F]" },
  sicar: { bg: "bg-[#16acf7]", border: "border-l-[#16acf7]", text: "text-[#16acf7]" },
  desconhecida: { bg: "bg-[#888888]", border: "border-l-[#888888]", text: "text-[#888888]" },
};

export type CategoryColor = keyof typeof colorMap;

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: IconName;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: CategoryColor;
}
export default function StatCard({ title, value, icon, color = "desconhecida" }: StatCardProps) {
  const config = colorMap[color];

  const formattedValue =
    typeof value === "number" ? new Intl.NumberFormat("pt-BR").format(value) : value;

  return (
    <div
      className={cn("rounded-lg border-l-4 p-6 shadow-sm bg-white transition-all", config.border)}
    >
      <div className="flex flex-col">
        <p className="font-medium text-slate-500">{title}</p>

        <div className="mt-3 flex items-center gap-3">
          {icon && (
            <div
              className={cn("p-2 rounded-lg flex items-center justify-center shrink-0", config.bg)}
            >
              <Icon name={icon} size={20} className="text-white" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <p className={cn("text-3xl font-bold tracking-tight", config.text)}>{formattedValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
