import React from "react";

interface AssessmentProgressBarProps {
  currentStep: number;
  totalSteps: number;
  domainName: string;
}

export default function AssessmentProgressBar({
  currentStep,
  totalSteps,
  domainName
}: AssessmentProgressBarProps) {
  const percentage = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  return (
    <div className="w-full bg-surface-card p-4 rounded-xl border border-border-default shadow-sm">
      <div className="flex justify-between items-center mb-2 text-xs font-bold">
        <span className="text-brand-primary uppercase tracking-wider">
          Domain: {domainName}
        </span>
        <span className="text-on-surface-variant">
          Step {currentStep + 1} of {totalSteps} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
