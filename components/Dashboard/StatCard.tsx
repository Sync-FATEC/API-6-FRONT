import React from "react";
import { cn } from "@/utils/className";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

const colorMap = {
  blue: "border-l-blue-500 bg-blue-50",
  green: "border-l-green-500 bg-green-50",
  orange: "border-l-orange-500 bg-orange-50",
  red: "border-l-red-500 bg-red-50",
  purple: "border-l-purple-500 bg-purple-50",
};

const textColorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
  purple: "text-purple-600",
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  description,
  color = "blue",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-6 shadow-sm transition-all hover:shadow-md",
        colorMap[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={cn("text-3xl font-bold", textColorMap[color])}>{value}</p>
            {trend && trendValue && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600"
                )}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        {icon && <div className="text-3xl opacity-20">{icon}</div>}
      </div>
    </div>
  );
}
