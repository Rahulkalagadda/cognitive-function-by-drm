import React from "react";
import { CheckCircle2 } from "lucide-react";

interface RecommendationsBlockProps {
  recommendations?: string[];
}

export default function RecommendationsBlock({ recommendations }: RecommendationsBlockProps) {
  const defaultRecs = [
    "Engage in high-frequency word puzzles and strategic memory games (minimum 15 mins daily) to stimulate the temporal lobe functions.",
    "Maintain a consistent sleep hygiene schedule with 7.5 to 8 hours of restorative rest to optimize memory consolidation processes.",
    "Incorporate light physical activity, such as brisk walking or yoga, 3 times a week to improve cerebral blood flow and coordination metrics.",
    "Schedule a 6-month clinical re-assessment to monitor progress in the Reasoning and Memory domains for longitudinal comparative analysis."
  ];

  const items = recommendations || defaultRecs;

  // Split items into two equal columns
  const col1 = items.slice(0, Math.ceil(items.length / 2));
  const col2 = items.slice(Math.ceil(items.length / 2));

  return (
    <div className="space-y-4">
      <h2 className="text-base font-extrabold text-[#1E293B] tracking-tight">
        Clinical Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="p-5 rounded-2xl border border-border-default bg-white shadow-sm space-y-4">
          {col1.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start select-none">
              <CheckCircle2 className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="p-5 rounded-2xl border border-border-default bg-white shadow-sm space-y-4">
          {col2.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start select-none">
              <CheckCircle2 className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
