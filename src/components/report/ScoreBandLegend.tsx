import React from "react";

export default function ScoreBandLegend() {
  const bands = [
    { label: "Exceptional", range: "85 - 100", bg: "bg-[#166534]" },
    { label: "Good", range: "70 - 84", bg: "bg-[#15803D]" },
    { label: "Monitoring", range: "50 - 69", bg: "bg-[#B45309]" },
    { label: "Attention", range: "0 - 49", bg: "bg-[#B91C1C]" }
  ];

  return (
    <div className="flex flex-wrap justify-between gap-3 bg-surface-page p-4 border border-border-default rounded-xl w-full max-w-sm mx-auto shadow-sm">
      {bands.map((band) => (
        <div key={band.label} className="flex items-center gap-1.5 select-none">
          <div className={`w-3 h-3 rounded-full ${band.bg}`} />
          <div className="text-[10px] font-bold text-on-surface">
            {band.label}
            <span className="text-on-surface-variant font-medium ml-1">({band.range})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
