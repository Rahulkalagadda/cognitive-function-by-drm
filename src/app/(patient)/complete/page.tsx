"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, LayoutDashboard, FileText } from "lucide-react";

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const reportId = searchParams.get("reportId");

  const handleGoDashboard = () => {
    router.push("/patient/dashboard");
  };

  const handleViewResults = () => {
    if (reportId) {
      router.push(`/results?token=${token}&reportId=${reportId}`);
    } else {
      router.push(`/results?token=${token}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col justify-center min-h-[80vh] animate-scaleIn">
      <Card className="border border-border-default shadow-card rounded-2xl bg-white overflow-hidden text-center p-8">
        <CardContent className="space-y-6 pt-6">
          {/* Complete Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-[#1E293B] tracking-tight">
              Assessment Completed!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-on-surface-variant leading-relaxed">
              Congratulations, you have completed the assigned cognitive evaluation battery. Your results have been compiled securely.
            </p>
          </div>

          {/* Clinician Note */}
          <div className="bg-surface-page p-4 border border-border-default rounded-xl text-left space-y-1">
            <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">
              Clinician Note
            </p>
            <p className="text-xs text-on-surface-variant/80 font-semibold leading-relaxed">
              Your results have been synced back to Dr. Priya Sharma. You may view your results summary report below or return to your patient wellness portal.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {reportId && (
              <button
                onClick={handleViewResults}
                type="button"
                className="w-full h-12 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="h-4.5 w-4.5" />
                View Results Report
              </button>
            )}

            <button
              onClick={handleGoDashboard}
              type="button"
              className="w-full h-12 border border-border-default hover:bg-surface-page text-on-surface font-extrabold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-on-surface-variant" />
              Go to Patient Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
