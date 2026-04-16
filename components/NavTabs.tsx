"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/className";
import Icon from "@/components/Icon";
import { IconName } from "@/components/Icon/IconName";

interface Tab {
  path: string;
  label: string;
  icon: IconName;
}

export default function NavTabs() {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { path: "/", label: "Consulta", icon: "search" },
    { path: "/dashboard", label: "Dashboard", icon: "bar-chart-2" },
  ];

  return (
    <div className="flex gap-1 bg-slate-50 rounded-lg p-1 mb-3 border border-slate-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              isActive
                ? "bg-white text-primary shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
