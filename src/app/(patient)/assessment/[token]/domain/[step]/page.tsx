"use client";

import React from "react";
import { useParams } from "next/navigation";
import AssessmentEngineWrapper from "@/components/assessment/AssessmentEngineWrapper";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function AssessmentStepPage() {
  const params = useParams();
  const { token, step } = params;

  if (!token || step === undefined) return null;
  const domainIndex = parseInt(step as string, 10);

  return (
    <AssessmentEngineWrapper 
      token={token as string} 
      domainIndex={domainIndex} 
    />
  );
}

export default withErrorBoundary(AssessmentStepPage);
