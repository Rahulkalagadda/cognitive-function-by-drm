"use client";

import React from "react";
import { Activity, ShieldAlert, Award, Zap, GitPullRequest, Layers, Eye, Brain } from "lucide-react";

interface ClinicalMetricsCardProps {
  clinicalMetrics?: Record<string, any>;
  hideHeader?: boolean;
}

export default function ClinicalMetricsCard({ clinicalMetrics = {}, hideHeader = false }: ClinicalMetricsCardProps) {
  const getVal = (taskId: string, key: string, suffix = "", scale = 1) => {
    const val = clinicalMetrics[taskId]?.[key];
    if (val === undefined || val === null) return "N/A";
    const numericVal = Number(val) * scale;
    // Format to 1 decimal place if float, else int
    const formattedVal = numericVal % 1 === 0 ? numericVal.toFixed(0) : numericVal.toFixed(1);
    return `${formattedVal}${suffix}`;
  };

  const hasData = Object.keys(clinicalMetrics).length > 0;

  if (!hasData) {
    return (
      <div className="bg-surface-card rounded-2xl border border-border-default p-6 text-center">
        <p className="text-xs text-on-surface-variant font-medium">No granular clinical metrics available for this assessment.</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Sustained Attention (CPT)",
      icon: Activity,
      color: "text-blue-500 bg-blue-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("cpt", "accuracy", "%") },
        { label: "Reaction Time", value: getVal("cpt", "reactionTime", " ms") },
        { label: "Vigilance Drop", value: getVal("cpt", "vigilanceDrop", "%") },
      ],
    },
    {
      title: "Impulsivity (Go/No-Go)",
      icon: ShieldAlert,
      color: "text-red-500 bg-red-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("go-no-go", "accuracy", "%") },
        { label: "Commission Errors", value: getVal("go-no-go", "commissionErrors") },
        { label: "Inhibitory Control Index", value: getVal("go-no-go", "inhibitoryControlIndex", "%", 100) },
      ],
    },
    {
      title: "Working Memory (N-Back)",
      icon: Award,
      color: "text-indigo-500 bg-indigo-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("n-back", "accuracy", "%") },
        { label: "N-Back Level Achieved", value: getVal("n-back", "nBackLevel", "", 1) },
      ],
    },
    {
      title: "Word Recall (Memory)",
      icon: Brain,
      color: "text-emerald-500 bg-emerald-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("word-recall", "accuracy", "%") },
        { label: "Retention Score", value: getVal("word-recall", "retentionScore", "%", 100) },
        { label: "Intrusion Errors", value: getVal("word-recall", "intrusionErrors") },
      ],
    },
    {
      title: "Updating",
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("updating", "accuracy", "%") },
        { label: "Updating Efficiency", value: getVal("updating", "updatingEfficiency", "%", 100) },
      ],
    },
    {
      title: "Executive Functioning (Tower)",
      icon: Layers,
      color: "text-teal-500 bg-teal-500/10",
      metrics: [
        { label: "Efficiency Score", value: getVal("tower-puzzle", "efficiencyScore", "%", 100) },
        { label: "Planning Time", value: getVal("tower-puzzle", "planningTimeMs", " sec", 0.001) },
      ],
    },
    {
      title: "Divided Attention",
      icon: GitPullRequest,
      color: "text-purple-500 bg-purple-500/10",
      metrics: [
        { label: "Primary Accuracy", value: getVal("divided-attention", "primaryAccuracy", "%") },
        { label: "Secondary Accuracy", value: getVal("divided-attention", "secondaryAccuracy", "%") },
        { label: "Interference Score", value: getVal("divided-attention", "interferenceScore", "%") },
      ],
    },
    {
      title: "Shape Match (Perception)",
      icon: Eye,
      color: "text-emerald-500 bg-emerald-500/10",
      metrics: [
        { label: "Accuracy", value: getVal("shape-match", "accuracy", "%") },
        { label: "Reaction Time", value: getVal("shape-match", "reactionTime", " ms") },
        { label: "Commission Errors", value: getVal("shape-match", "commissionErrors") },
      ],
    },
  ];

  // Only show sections where at least one metric is not "N/A"
  const visibleSections = sections.filter(sect =>
    sect.metrics.some(m => m.value !== "N/A")
  );

  return (
    <section className={`space-y-4 ${hideHeader ? "" : "border-b border-border-default pb-6"}`}>
      {!hideHeader && (
        <h3 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider text-center md:text-left">
          Detailed Clinical Metrics
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSections.map((sect, i) => {
          const Icon = sect.icon;
          return (
            <div key={i} className="p-4 bg-surface-muted/30 rounded-xl border border-border-default flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${sect.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-extrabold text-on-surface leading-tight">
                  {sect.title}
                </h4>
              </div>
              <div className="space-y-1.5 font-medium text-xs text-on-surface-variant">
                {sect.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5">
                    <span>{m.label}</span>
                    <span className="font-extrabold text-on-surface font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
