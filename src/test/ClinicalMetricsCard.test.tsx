import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClinicalMetricsCard from "../components/report/ClinicalMetricsCard";

describe("ClinicalMetricsCard", () => {
  it("renders empty state message when no metrics are provided", () => {
    render(<ClinicalMetricsCard />);
    expect(
      screen.getByText("No granular clinical metrics available for this assessment.")
    ).toBeInTheDocument();
  });

  it("renders all clinical metric domains and values correctly when provided", () => {
    const sampleMetrics = {
      cpt: {
        accuracy: 82,
        reactionTime: 468,
        vigilanceDrop: -12,
      },
      "go-no-go": {
        accuracy: 78,
        commissionErrors: 4,
        inhibitoryControlIndex: 0.74,
      },
      "n-back": {
        accuracy: 80,
        nBackLevel: 3,
      },
      "word-recall": {
        accuracy: 85,
        retentionScore: 0.87,
        intrusionErrors: 1,
      },
      updating: {
        accuracy: 72,
        updatingEfficiency: 0.68,
      },
      "tower-puzzle": {
        efficiencyScore: 0.81,
        planningTimeMs: 8400,
      },
      "divided-attention": {
        primaryAccuracy: 86,
        secondaryAccuracy: 75,
        interferenceScore: 18,
        dualTaskCostVisual: -15,
        dualTaskCostAuditory: -10,
        rtVariability: 45,
      },
    };

    render(<ClinicalMetricsCard clinicalMetrics={sampleMetrics} />);

    // Titles
    expect(screen.getByText("Sustained Attention (CPT)")).toBeInTheDocument();
    expect(screen.getByText("Impulsivity (Go/No-Go)")).toBeInTheDocument();
    expect(screen.getByText("Working Memory (N-Back)")).toBeInTheDocument();
    expect(screen.getByText("Word Recall (Memory)")).toBeInTheDocument();
    expect(screen.getByText("Updating")).toBeInTheDocument();
    expect(screen.getByText("Executive Functioning (Tower)")).toBeInTheDocument();
    expect(screen.getByText("Divided Attention")).toBeInTheDocument();

    // Specific metrics values
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("468 ms")).toBeInTheDocument();
    expect(screen.getByText("-12%")).toBeInTheDocument();
    expect(screen.getByText("74%")).toBeInTheDocument(); // 0.74 * 100
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument(); // 0.87 * 100
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument(); // 0.68 * 100
    expect(screen.getByText("81%")).toBeInTheDocument(); // 0.81 * 100
    expect(screen.getByText("8.4 sec")).toBeInTheDocument(); // 8400 ms
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("-15%")).toBeInTheDocument();
    expect(screen.getByText("-10%")).toBeInTheDocument();
    expect(screen.getByText("45 ms")).toBeInTheDocument();
  });
});
