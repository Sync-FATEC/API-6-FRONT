import React from "react";
import { cn } from "@/utils/className";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function DashboardCard({
  title,
  subtitle,
  children,
  className,
  headerAction,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-6 shadow-sm transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
