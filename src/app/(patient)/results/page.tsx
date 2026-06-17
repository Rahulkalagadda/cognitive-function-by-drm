"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useReport } from "@/hooks/useReport";
import { useAssessment } from "@/hooks/useAssessment";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import ScoreGauge from "@/components/report/ScoreGauge";
import DomainScoreRow from "@/components/report/DomainScoreRow";
import DomainDonut from "@/components/report/DomainDonut";
import ScoreBandLegend from "@/components/report/ScoreBandLegend";
import RecommendationsBlock from "@/components/report/RecommendationsBlock";
import { Printer, Download, LayoutDashboard, Calendar, FileText, User } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { CognitiveDomain } from "@/types/assessment.types";

export default function ResultsReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const reportIdParam = searchParams.get("reportId");

  const { selectedReport, fetchReportById, fetchReports, reports, isLoading, error } = useReport();
  const { currentSession, loadSession } = useAssessment();

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
    fetchReports();
  }, [token, loadSession, fetchReports]);

  useEffect(() => {
    if (reportIdParam) {
      fetchReportById(reportIdParam);
    } else if (reports.length > 0 && token) {
      // Fallback to most recent report for this token/patient
      const match = reports.find((r) => r.patientId === token || r.patientName.toLowerCase().includes("sunita"));
      if (match) {
        fetchReportById(match.id);
      }
    }
  }, [reportIdParam, reports, token, fetchReportById]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading || !selectedReport) {
    return <LoadingScreen message="Compiling diagnostics score report..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* Action Header bar (no-print) */}
      <div className="max-w-[800px] mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-border-default rounded-2xl p-4 shadow-sm no-print">
        <button
          onClick={() => router.push("/patient/dashboard")}
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-border-default hover:bg-surface-page text-on-surface font-extrabold text-xs rounded-xl transition-all active:scale-[0.97]"
        >
          <LayoutDashboard className="h-4 w-4 text-on-surface-variant" />
          Patient Dashboard
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-border-default hover:bg-surface-page text-on-surface font-extrabold text-xs rounded-xl transition-all active:scale-[0.97]"
          >
            <Printer className="h-4 w-4 text-on-surface-variant" />
            Print Report
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-sm font-extrabold text-xs rounded-xl transition-all active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable A4 Report Canvas */}
      <main className="max-w-[800px] mx-auto bg-white border border-border-default rounded-2xl shadow-card p-6 md:p-12 flex flex-col gap-8">
        
        {/* Report Top Header */}
        <section className="flex justify-between items-center pb-4 border-b border-border-default select-none">
          <Logo className="h-10 w-auto" />
          <div className="text-center hidden sm:block">
            <h1 className="text-sm font-black uppercase text-on-surface-variant tracking-widest">
              Cognitive Assessment Report
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">REPORT ID</p>
            <p className="text-xs font-mono font-bold text-brand-primary">{selectedReport.reportId}</p>
          </div>
        </section>

        {/* Patient Details Grid */}
        <section className="grid grid-cols-2 gap-6 py-2 text-xs font-semibold text-on-surface-variant select-none">
          <div className="space-y-3">
            <div className="flex gap-2 items-baseline">
              <span className="w-24 text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70">Patient</span>
              <span className="text-on-surface font-black">{selectedReport.patientName}</span>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="w-24 text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70">Age / Sex</span>
              <span className="text-on-surface">{selectedReport.patientAge} years / Female</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2 items-baseline">
              <span className="w-24 text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70">Date Issued</span>
              <span className="text-on-surface">{new Date(selectedReport.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="w-24 text-[9px] font-black uppercase tracking-wider text-on-surface-variant/70">Clinician</span>
              <span className="text-on-surface">Dr. Priya Sharma</span>
            </div>
          </div>
        </section>

        <hr className="border-border-default" />

        {/* Overall score breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-2">
          {/* Gauge Center */}
          <div className="flex flex-col items-center justify-center">
            <ScoreGauge score={selectedReport.totalScore} />
          </div>

          {/* Recharts Donut distribution */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-2">
              Domain distribution
            </p>
            <DomainDonut
              data={Object.entries(selectedReport.domainScores).map(([name, value]) => ({
                name,
                value
              }))}
            />
          </div>

          {/* Domain lists */}
          <div className="space-y-3.5">
            {(Object.keys(selectedReport.domainScores) as CognitiveDomain[]).map((dom) => (
              <DomainScoreRow
                key={dom}
                domain={dom}
                score={selectedReport.domainScores[dom]}
              />
            ))}
          </div>
        </section>

        <hr className="border-border-default" />

        {/* Bands Legend */}
        <ScoreBandLegend />

        {/* Recommendations */}
        <RecommendationsBlock recommendations={selectedReport.recommendations} />

        {/* Report Footer */}
        <footer className="mt-8 pt-6 border-t border-border-default flex justify-between items-end text-[10px] text-on-surface-variant/70 leading-relaxed font-semibold">
          <div className="max-w-[480px]">
            <p>
              This report is generated by Cognitive Assessment Platform · Confidential · Clinical use only. CogHealth diagnostic standards © 2024. Does not constitute a neurological diagnosis.
            </p>
          </div>
          <div className="text-right">
            <p>Page 01 of 01</p>
            <p>System Ver: {selectedReport.systemVersion || "2.4.1-LTS"}</p>
          </div>
        </footer>

      </main>
    </div>
  );
}
