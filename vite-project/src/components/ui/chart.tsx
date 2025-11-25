import React from "react";
import { Tooltip } from "recharts";

// Type pour la config des charts
export type ChartConfig = Record<string, { label: string; color: string }>;

// Container pour le chart avec styles
export function ChartContainer({
  config,
  children,
  className="",
}: {
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full h-72">
      {children}
    </div>
  );
}

// Tooltip custom pour Recharts
export function ChartTooltip({
  active,
  payload,
  label,
  content,
}: any) {
  if (content) return content;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-md border border-gray-200">
        <p className="font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex justify-between">
            <span className="capitalize">{p.name}</span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Contenu tooltip pour pouvoir le custom
export function ChartTooltipContent({
  hideLabel,
  payload,
}: {
  hideLabel?: boolean;
  payload?: any;
}) {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="bg-white p-2 rounded shadow-md border border-gray-200">
      {!hideLabel && <p className="font-medium">{payload[0].payload.month}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between">
          <span className="capitalize">{p.name}</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegend({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 mt-4 ${className}`}>
      {children}
    </div>
  );
}

export function ChartLegendContent({
  payload,
  nameKey = "name",
}: {
  payload?: any[];
  nameKey?: string;
}) {
  if (!payload) return null;

  return (
    <>
      {payload.map((entry, i) => {
        const color =
          entry.color ||
          (entry.payload?.fill ? entry.payload.fill : "#000"); 

        return (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            ></span>

            <span className="font-medium">
              {entry.payload?.[nameKey] ?? entry[nameKey]}
            </span>

            {entry.value !== undefined && (
              <span className="text-muted-foreground">({entry.value})</span>
            )}
          </div>
        );
      })}
    </>
  );
}



