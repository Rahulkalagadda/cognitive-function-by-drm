"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useReport } from "@/hooks/useReport";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import ReportHeader from "@/components/report/ReportHeader";
import ScoreGauge from "@/components/report/ScoreGauge";
import DomainScoreRow from "@/components/report/DomainScoreRow";
import RecommendationsBlock from "@/components/report/RecommendationsBlock";
import ClinicalMetricsCard from "@/components/report/ClinicalMetricsCard";
import { FileText, Printer, Download, ArrowLeft, Search, Eye, Clipboard } from "lucide-react";
import { CognitiveDomain } from "@/types/assessment.types";
import { BASE_URL } from "@/services/http";

function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportIdParam = searchParams.get("id");
  const { reports, selectedReport, fetchReports, fetchReportById, isLoading, error } = useReport();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (reportIdParam) {
      fetchReportById(reportIdParam);
    }
  }, [reportIdParam, fetchReportById]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;
    let url = `${BASE_URL}/reports/${selectedReport.id}/pdf`;
    const params: string[] = [];
    const doctorToken = localStorage.getItem("cap_token");
    if (doctorToken) {
      params.push(`auth_token=${encodeURIComponent(doctorToken)}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    window.location.href = url;
  };

  const filteredReports = reports.filter((r) =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reportId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingScreen message="Loading clinical diagnostics databases..." />;
  }

  // --- 1. SINGLE DETAIL REPORT VIEW ---
  if (reportIdParam && selectedReport) {
    return (
      <>
        {/* Floating print actions for A4 layout */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row gap-3 no-print">
          <button
            onClick={handlePrint}
            className="w-12 h-12 flex items-center justify-center bg-surface-card border border-border-default rounded-full shadow-lg text-on-surface hover:bg-surface-muted transition-all active:scale-95"
            title="Print Report"
          >
            <Printer className="h-5 w-5" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-primary/95 transition-all active:scale-95 text-xs font-bold"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="space-y-6 animate-fadeIn">
          {/* Back breadcrumb */}
          <button
            onClick={() => router.push("/reports")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors no-print"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Reports List</span>
          </button>

        {/* A4 Canvas Sheet container */}
        <div className="max-w-[800px] mx-auto bg-surface-card border border-border-default rounded-2xl shadow-card p-6 md:p-12 paper-container flex flex-col gap-6">
          
          {/* Report brand header */}
          <ReportHeader report={selectedReport} />

          {/* Scores breakdown Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-4 border-b border-border-default pb-6">
            <div className="flex justify-center md:border-r border-border-default pr-0 md:pr-8">
              <ScoreGauge score={selectedReport.totalScore} />
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider text-center md:text-left">
                Cognitive Domain Performance
              </h3>
              
              <div className="space-y-3.5">
                {(Object.keys(selectedReport.domainScores) as CognitiveDomain[]).map((dom) => (
                  <DomainScoreRow
                    key={dom}
                    domain={dom}
                    score={selectedReport.domainScores[dom]}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Detailed clinical metrics */}
          <ClinicalMetricsCard clinicalMetrics={selectedReport.clinicalMetrics} />

          {/* Clinical Screening Scales (PHQ-9, GAD-7, PSS-10) */}
          {((selectedReport.phq9Score !== undefined && selectedReport.phq9Score !== null) ||
            (selectedReport.gad7Score !== undefined && selectedReport.gad7Score !== null) ||
            (selectedReport.pss10Score !== undefined && selectedReport.pss10Score !== null)) && (
            <section className="space-y-3 border-b border-border-default pb-6">
              <h3 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                <Clipboard className="h-3.5 w-3.5" />
                Clinical Screening Scales
              </h3>
              <table className="w-full text-left border-collapse rounded-xl overflow-hidden text-xs">
                <thead>
                  <tr className="bg-surface-muted/50">
                    <th className="p-3 font-extrabold text-on-surface-variant uppercase tracking-wider border border-border-default">Scale</th>
                    <th className="p-3 font-extrabold text-on-surface-variant uppercase tracking-wider border border-border-default text-center">Score</th>
                    <th className="p-3 font-extrabold text-on-surface-variant uppercase tracking-wider border border-border-default">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {selectedReport.phq9Score !== undefined && selectedReport.phq9Score !== null && (() => {
                    const val = selectedReport.phq9Score!;
                    let interp = "Minimal / Subclinical"; let color = "text-emerald-700";
                    if (val >= 15) { interp = "Moderately Severe–Severe Depression"; color = "text-red-600"; }
                    else if (val >= 10) { interp = "Moderate Depression"; color = "text-amber-600"; }
                    else if (val >= 5) { interp = "Mild Depression"; color = "text-teal-600"; }
                    return (
                      <tr key="phq9" className="hover:bg-surface-muted/30">
                        <td className="p-3 text-on-surface font-medium border border-border-default">PHQ-9 (Depressive Symptomatology)</td>
                        <td className="p-3 text-center font-extrabold text-on-surface font-mono border border-border-default">{val} / 27</td>
                        <td className={`p-3 font-semibold border border-border-default ${color}`}>{interp}</td>
                      </tr>
                    );
                  })()}
                  {selectedReport.gad7Score !== undefined && selectedReport.gad7Score !== null && (() => {
                    const val = selectedReport.gad7Score!;
                    let interp = "Minimal / Subclinical"; let color = "text-emerald-700";
                    if (val >= 15) { interp = "Severe Anxiety"; color = "text-red-600"; }
                    else if (val >= 10) { interp = "Moderate Anxiety"; color = "text-amber-600"; }
                    else if (val >= 5) { interp = "Mild Anxiety"; color = "text-teal-600"; }
                    return (
                      <tr key="gad7" className="hover:bg-surface-muted/30">
                        <td className="p-3 text-on-surface font-medium border border-border-default">GAD-7 (Generalized Anxiety Scale)</td>
                        <td className="p-3 text-center font-extrabold text-on-surface font-mono border border-border-default">{val} / 21</td>
                        <td className={`p-3 font-semibold border border-border-default ${color}`}>{interp}</td>
                      </tr>
                    );
                  })()}
                  {selectedReport.araqScore !== undefined && selectedReport.araqScore !== null && (() => {
                    const val = selectedReport.araqScore!;
                    return (
                      <tr key="araq" className="hover:bg-surface-muted/30">
                        <td className="p-3 text-on-surface font-medium border border-border-default">ARAQ (ADHD-Related Avoidance & Anxiety)</td>
                        <td className="p-3 text-center font-extrabold text-on-surface font-mono border border-border-default">{val} / 104</td>
                        <td className="p-3 font-semibold border border-border-default text-brand-primary text-xs space-y-0.5">
                          <div>• Sec A (Exec Dysf): <b>{selectedReport.araqSecAScore ?? 0}</b>/32</div>
                          <div>• Sec B (Anticip Anxiety): <b>{selectedReport.araqSecBScore ?? 0}</b>/24</div>
                          <div>• Sec C (Fear Failure): <b>{selectedReport.araqSecCScore ?? 0}</b>/32</div>
                          <div>• Sec D (Functional Imp): <b>{selectedReport.araqSecDScore ?? 0}</b>/16</div>
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </section>
          )}

          {/* Recommendations block */}
          <RecommendationsBlock recommendations={selectedReport.recommendations} />

          {/* Report Footer */}
          <footer className="mt-auto pt-6 border-t border-border-default flex justify-between items-end text-[10px] text-on-surface-variant/70 leading-relaxed font-semibold">
            <div className="max-w-[480px]">
              <p>
                This report is generated by Cognitive Assessment Platform · Confidential · Clinical use only. CogHealth diagnostic standards © 2024. Does not constitute a neurological diagnosis.
              </p>
            </div>
            <div className="text-right">
              <p>Page 01 of 01</p>
              <p>System Ver: {selectedReport.systemVersion}</p>
            </div>
          </footer>

        </div>
      </div>
      </>
    );
  }

  // --- 2. REPORTS DIRECTORY LIST VIEW ---
  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Clinical Reports"
        description="Search patient cognitive assessment scores, download PDF summaries or trigger printing."
      />

      {/* Filter Row */}
      <div className="bg-surface-card rounded-2xl border border-border-default p-4 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name or report ID..."
            aria-label="Search reports by patient name or report ID"
            className="w-full pl-9 pr-4 py-2 border border-border-default rounded-xl text-xs bg-surface-page focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          />
        </div>
      </div>

      {/* Report directory items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-5 bg-surface-card rounded-2xl border border-border-default shadow-card hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex justify-between items-center group"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-on-surface leading-tight">
                    {report.patientName}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    {report.reportId}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant/80 font-medium">
                Tested on: {new Date(report.createdAt).toLocaleDateString()} · Age: {report.patientAge}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-brand-secondary font-mono">
                  {report.totalScore}%
                </span>
                <p className="text-[9px] font-extrabold text-on-surface-variant uppercase tracking-widest mt-0.5">
                  {report.scoreStatus}
                </p>
              </div>

              <button
                onClick={() => router.push(`/reports?id=${report.id}`)}
                className="p-2.5 rounded-xl border border-border-default text-on-surface-variant bg-surface-muted/30 hover:bg-surface-muted hover:text-on-surface transition-all active:scale-95"
                title="View Report Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withErrorBoundary(ReportsPage);
