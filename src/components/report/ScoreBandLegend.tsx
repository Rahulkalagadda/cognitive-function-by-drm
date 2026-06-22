import React from "react";

export default function ScoreBandLegend() {
  const bands = [
    { label: "Above Average", range: "75 – 100", bg: "bg-[#0f766e]" },
    { label: "Average",        range: "50 – 74",  bg: "bg-[#d97706]" },
    { label: "Below Average",  range: "0 – 49",   bg: "bg-[#dc2626]" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-5 bg-surface-page p-4 border border-border-default rounded-xl w-full shadow-sm">
      {bands.map((band) => (
        <div key={band.label} className="flex items-center gap-2 select-none">
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
