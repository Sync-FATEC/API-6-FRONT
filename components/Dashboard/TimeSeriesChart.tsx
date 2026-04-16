"use client";

import React from "react";
import DashboardCard from "./DashboardCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
}

export default function TimeSeriesChart({
  title,
  subtitle,
  data,
  dataKeyValue,
  dataKeyLabel,
  type = "bar",
  color = "#3b82f6",
}: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <DashboardCard title={title} subtitle={subtitle}>
        <div className="h-64 flex items-center justify-center text-slate-500">Sem dados disponíveis</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={dataKeyLabel} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Bar dataKey={dataKeyValue} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={dataKeyLabel} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKeyValue}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </DashboardCard>
  );
}
