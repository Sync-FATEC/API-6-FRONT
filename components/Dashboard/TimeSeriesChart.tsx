"use client";

import { useMemo } from "react";
import DashboardCard from "./DashboardCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimeSeriesData {
  [key: string]: string | number;
}

interface TimeSeriesChartProps {
  title: string;
  subtitle?: string;
  data: TimeSeriesData[];
  dataKeyValue: string;
  dataKeyLabel: string;
  type?: "bar" | "line";
  color?: string;
  smooth?: boolean;
  smoothWindow?: number;
  showRaw?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="z-50 rounded-md bg-slate-950 p-3 text-sm text-white shadow-lg border border-slate-800">
        <p className="font-medium text-slate-300 mb-1">{label}</p>
        <p className="font-bold flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: payload[0].color }}
          />
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function movingAverage(data: TimeSeriesData[], key: string, window: number) {
  return data.map((item, index, arr) => {
    const start = Math.max(0, index - window + 1);
    const slice = arr.slice(start, index + 1);

    const avg = slice.reduce((sum, curr) => sum + Number(curr[key]), 0) / slice.length;

    return {
      ...item,
      [key]: Math.round(avg),
    };
  });
}

export default function TimeSeriesChart({
  title,
  subtitle,
  data,
  dataKeyValue,
  dataKeyLabel,
  type = "bar",
  color = "#3b82f6",
  smooth = false,
  smoothWindow = 7,
  showRaw = false,
}: TimeSeriesChartProps) {
  const processedData = useMemo(() => {
    if (!smooth) return data;
    return movingAverage(data, dataKeyValue, smoothWindow);
  }, [data, smooth, smoothWindow, dataKeyValue]);

  if (!data || data.length === 0) {
    return (
      <DashboardCard title={title} subtitle={subtitle}>
        <div className="h-64 flex items-center justify-center text-slate-500">
          Sem dados disponíveis
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" ? (
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey={dataKeyLabel}
              stroke="#94a3b8"
              minTickGap={60}
              tickFormatter={(value) => value.slice(0, 5)}
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              content={<CustomTooltipContent />}
              cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
            />

            <Bar dataKey={dataKeyValue} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey={dataKeyLabel}
              stroke="#94a3b8"
              minTickGap={60}
              tickFormatter={(value) => value.slice(0, 5)}
              interval="preserveEnd"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              content={<CustomTooltipContent />}
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" }}
            />

            {showRaw && smooth && (
              <Line
                type="linear"
                dataKey={dataKeyValue}
                stroke={color}
                strokeOpacity={0.25}
                strokeWidth={1}
                dot={false}
              />
            )}

            <Line
              type="monotone"
              dataKey={dataKeyValue}
              stroke={color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </DashboardCard>
  );
}
