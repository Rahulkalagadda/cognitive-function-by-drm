"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface DomainDonutProps {
  data: { name: string; value: number }[];
}

export default function DomainDonut({ data }: DomainDonutProps) {
  // Color registry
  const COLORS: Record<string, string> = {
    Attention: "#2563EB",
    Memory: "#7C3AED",
    Executive: "#0D9488",
    Processing: "#F59E0B",
    Perception: "#D85A30",
    Coordination: "#10B981",
    Reasoning: "#0D9488" // Reason mapping
  };

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.value,
  }));

  return (
    <div className="w-full h-48 sm:h-56 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#64748B"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "11px",
              fontWeight: "bold",
              color: "#1E293B",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none">
        <span className="text-2xl font-black text-[#1E293B]">5</span>
        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Domains</span>
      </div>
    </div>
  );
}
