import React from "react";
import { CheckCircle2 } from "lucide-react";

interface RecommendationsBlockProps {
  recommendations: string[];
}

export default function RecommendationsBlock({ recommendations }: RecommendationsBlockProps) {
  // Split recommendations into two columns for visual balance
  const col1 = recommendations.filter((_, idx) => idx % 2 === 0);
  const col2 = recommendations.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-extrabold text-on-surface tracking-tight">
        Clinical Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="p-4 bg-surface-muted/30 border border-border-default rounded-xl space-y-3 shadow-sm">
          {col1.map((rec, index) => (
            <div key={index} className="flex gap-2.5 items-start text-xs text-on-surface-variant font-medium leading-relaxed">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
        
        {/* Column 2 */}
        <div className="p-4 bg-surface-muted/30 border border-border-default rounded-xl space-y-3 shadow-sm">
          {col2.map((rec, index) => (
            <div key={index} className="flex gap-2.5 items-start text-xs text-on-surface-variant font-medium leading-relaxed">
              <CheckCircle2 className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
