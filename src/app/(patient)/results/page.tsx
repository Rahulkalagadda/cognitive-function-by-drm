"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useReport } from "@/hooks/useReport";
import { useAssessment } from "@/hooks/useAssessment";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Download, Target, Brain, Lightbulb, Activity, Eye, Clipboard, ArrowLeft } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { BASE_URL } from "@/services/http";
import ClinicalMetricsCard from "@/components/report/ClinicalMetricsCard";

const domainConfig = {
  Attention: {
    title: "Attention",
    icon: Target,
    bgCircle: "bg-[#dbe1ff]/60",
    iconColor: "text-[#004ac6]",
    getDesc: (score: number) => {
      if (score >= 75) return "Exceptional ability to sustain focus during prolonged tasks and filter distractions.";
      if (score >= 50) return "Sustained attention and task focus are within expected baseline ranges with minor variance.";
      return "Difficulties in maintaining focus and filtering out external auditory or visual distractions.";
    }
  },
  Memory: {
    title: "Memory",
    icon: Brain,
    bgCircle: "bg-[#ffdbcd]/50",
    iconColor: "text-[#943700]",
    getDesc: (score: number) => {
      if (score >= 75) return "Excellent short-term memory capacity, with quick recall and solid retention.";
      if (score >= 50) return "Ability to retain and recall recent information within expected clinical ranges.";
      return "Significant challenges in consolidating and retrieving recently learned visual or verbal data.";
    }
  },
  Reasoning: {
    title: "Reasoning",
    icon: Lightbulb,
    bgCircle: "bg-[#89f5e7]/40",
    iconColor: "text-[#006a61]",
    getDesc: (score: number) => {
      if (score >= 75) return "Strong performance in logical deduction and solving novel problems effectively.";
      if (score >= 50) return "Logical problem-solving and deductive abilities are within normal limits.";
      return "Difficulties identifying abstract patterns or forming logical deductions under time constraints.";
    }
  },
  Coordination: {
    title: "Coordination",
    icon: Activity,
    bgCircle: "bg-[#ffecb3]/60",
    iconColor: "text-[#D97706]",
    getDesc: (score: number) => {
      if (score >= 75) return "Superb sensorimotor integration, reaction speed, and fine-motor command control.";
      if (score >= 50) return "Sensorimotor integration and fine motor response times are within normal limits.";
      return "Delays in motor response timing or coordination under dynamic processing tasks.";
    }
  },
  Perception: {
    title: "Perception",
    icon: Eye,
    bgCircle: "bg-[#ffdad6]/60",
    iconColor: "text-[#DC2626]",
    getDesc: (score: number) => {
      if (score >= 75) return "Superior visual processing, spatial mapping, and pattern discrimination.";
      if (score >= 50) return "Visual processing and spatial awareness show consistent and reliable output for current age group.";
      return "Difficulties in spatial orientation, shape identification, or visual scanning tasks.";
    }
  }
};

type DomainKey = keyof typeof domainConfig;

export default function ResultsReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const reportIdParam = searchParams.get("reportId");

  const { selectedReport, fetchReportById, isLoading, error } = useReport();
  const { loadSession } = useAssessment();

  const [scrolled, setScrolled] = useState(false);
  const [dashOffset, setDashOffset] = useState(440);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("cap_token"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  useEffect(() => {
    if (reportIdParam) {
      fetchReportById(reportIdParam);
    }
  }, [reportIdParam, fetchReportById]);

  useEffect(() => {
    if (selectedReport) {
      const score = selectedReport.totalScore ?? 0;
      const timer = setTimeout(() => {
        setDashOffset(440 - (440 * score) / 100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedReport]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToDashboard = () => {
    const role = localStorage.getItem("cap_role");
    if (role === "doctor" || role === "clinician") {
      router.push("/reports");
    } else {
      router.push("/patient/dashboard");
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;
    let url = `${BASE_URL}/reports/${selectedReport.id}/pdf`;
    const params: string[] = [];
    
    if (token) {
      params.push(`token=${encodeURIComponent(token)}`);
    }
    
    const patientId = localStorage.getItem("cap_patient_id");
    if (patientId) {
      params.push(`patient_id=${encodeURIComponent(patientId)}`);
    }
    
    const doctorToken = localStorage.getItem("cap_token");
    const role = localStorage.getItem("cap_role");
    if (doctorToken && role !== "patient") {
      params.push(`auth_token=${encodeURIComponent(doctorToken)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    
    window.location.href = url;
  };

  if (isLoading || !selectedReport) {
    return <LoadingScreen message="Compiling diagnostics score report..." />;
  }

  if (error) {
    return <ErrorState title="Report Error" message={error} />;
  }

  const score = selectedReport.totalScore ?? 0;
  
  // Overall score pill styles
  let statusBadgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 75) {
    statusBadgeColor = "text-emerald-700 bg-emerald-50 border border-emerald-200";
  } else if (score >= 50) {
    statusBadgeColor = "text-amber-700 bg-amber-50 border border-amber-200";
  } else {
    statusBadgeColor = "text-red-700 bg-red-50 border border-red-200";
  }

  const domains: DomainKey[] = ["Attention", "Memory", "Reasoning", "Coordination", "Perception"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Fixed Header Bar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="flex items-center">
          <Logo className="h-8 w-auto" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-base md:text-xl font-bold text-slate-800">{selectedReport.patientName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 border-2 border-[#006a61] text-[#006a61] font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-[#86f2e4]/20 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => router.push("/patient-login")}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-semibold text-sm px-4 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="pt-24 pb-32 px-4 md:px-6 max-w-5xl mx-auto space-y-8">
        
        {/* Performance Hero card */}
        <section className="bg-white shadow-sm rounded-2xl p-6 md:p-10 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left: Circular gauge */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-[200px] h-[200px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                  </defs>
                  <circle className="fill-none stroke-slate-100 stroke-[14px]" cx="80" cy="80" r="70" />
                  <circle
                    className="fill-none stroke-[url(#gaugeGradient)] stroke-[14px] stroke-linecap-round transition-all duration-1000 ease-out"
                    cx="80"
                    cy="80"
                    r="70"
                    strokeDasharray="440"
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-slate-800">
                    {score}
                    <span className="text-slate-500 text-lg font-normal"> / 100</span>
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mt-2 ${statusBadgeColor}`}>
                    {selectedReport.scoreStatus || "Average"}
                  </span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-500 text-center max-w-xs leading-relaxed">
                Overall cognitive health index based on normalized population data.
              </p>
            </div>

            {/* Right: Domain Score list */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-[#2563EB] pl-3">
                Performance Summary
              </h3>
              <div className="space-y-5">
                {domains.map((dom) => {
                  const val = selectedReport.domainScores[dom] ?? 0;
                  return (
                    <div key={dom} className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-xs md:text-sm font-semibold text-slate-700">{dom}</span>
                        <span className="text-xs font-bold text-[#0D9488]">{val}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-[#0D9488] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Section Label: Domain Breakdown */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Domain breakdown</h2>
          <div className="h-px flex-grow bg-slate-200"></div>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((dom) => {
            const config = domainConfig[dom];
            const val = selectedReport.domainScores[dom] ?? 0;
            const IconComponent = config.icon;

            let statusLabel = "AVERAGE";
            let statusClass = "text-amber-700 bg-amber-50 border-amber-200";
            if (val >= 75) {
              statusLabel = "GOOD";
              statusClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
            } else if (val < 50) {
              statusLabel = "POOR";
              statusClass = "text-red-700 bg-red-50 border-red-200";
            }

            return (
              <div
                key={dom}
                className={`bg-white p-6 rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-200 ${
                  dom === "Perception" ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${config.bgCircle} flex items-center justify-center ${config.iconColor}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 leading-tight">{config.title}</h4>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mt-1 border ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-[#004ac6]">{val}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{config.getDesc(val)}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Clinical Metrics */}
        {selectedReport.clinicalMetrics && Object.keys(selectedReport.clinicalMetrics).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-bold text-slate-800">Detailed clinical metrics</h2>
              <div className="h-px flex-grow bg-slate-200"></div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <ClinicalMetricsCard clinicalMetrics={selectedReport.clinicalMetrics} hideHeader={true} />
            </div>
          </div>
        )}

        {/* Clinical Screening Scales Card */}
        {((selectedReport.phq9Score !== undefined && selectedReport.phq9Score !== null) ||
          (selectedReport.gad7Score !== undefined && selectedReport.gad7Score !== null) ||
          (selectedReport.pss10Score !== undefined && selectedReport.pss10Score !== null)) && (
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-[#EFF4FF] px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-[#2563EB]" />
              <h3 className="text-base font-bold text-slate-800">Clinical Screening Scales</h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Scale Name</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Total Score</th>
                    <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Clinical Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedReport.phq9Score !== undefined && selectedReport.phq9Score !== null && (() => {
                    const val = selectedReport.phq9Score;
                    let interp = "Minimal / Subclinical";
                    let color = "text-teal-600 font-semibold";
                    if (val >= 15) {
                      interp = "Moderately Severe to Severe Depression";
                      color = "text-red-600 font-semibold";
                    } else if (val >= 10) {
                      interp = "Moderate Depression";
                      color = "text-amber-600 font-semibold";
                    } else if (val >= 5) {
                      interp = "Mild Depression";
                      color = "text-teal-600 font-semibold";
                    }
                    return (
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-4 text-sm text-slate-700">PHQ-9 (Depressive Symptomatology)</td>
                        <td className="p-4 text-sm text-slate-700 text-center font-semibold">{val} / 27</td>
                        <td className={`p-4 text-sm ${color}`}>{interp}</td>
                      </tr>
                    );
                  })()}

                  {selectedReport.gad7Score !== undefined && selectedReport.gad7Score !== null && (() => {
                    const val = selectedReport.gad7Score;
                    let interp = "Minimal / Subclinical";
                    let color = "text-teal-600 font-semibold";
                    if (val >= 15) {
                      interp = "Severe Anxiety";
                      color = "text-red-600 font-semibold";
                    } else if (val >= 10) {
                      interp = "Moderate Anxiety";
                      color = "text-amber-600 font-semibold";
                    } else if (val >= 5) {
                      interp = "Mild Anxiety";
                      color = "text-teal-600 font-semibold";
                    }
                    return (
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-4 text-sm text-slate-700">GAD-7 (Generalized Anxiety Scale)</td>
                        <td className="p-4 text-sm text-slate-700 text-center font-semibold">{val} / 21</td>
                        <td className={`p-4 text-sm ${color}`}>{interp}</td>
                      </tr>
                    );
                  })()}

                  {selectedReport.pss10Score !== undefined && selectedReport.pss10Score !== null && (() => {
                    const val = selectedReport.pss10Score;
                    let interp = "Low Perceived Stress";
                    let color = "text-teal-600 font-semibold";
                    if (val >= 27) {
                      interp = "High Perceived Stress";
                      color = "text-red-600 font-semibold";
                    } else if (val >= 14) {
                      interp = "Moderate Perceived Stress";
                      color = "text-amber-600 font-semibold";
                    }
                    return (
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-4 text-sm text-slate-700">PSS-10 (Perceived Stress Scale)</td>
                        <td className="p-4 text-sm text-slate-700 text-center font-semibold">{val} / 40</td>
                        <td className={`p-4 text-sm ${color}`}>{interp}</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Recommendations Card */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#EFF4FF] px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-[#2563EB]" />
            <h3 className="text-base font-bold text-slate-800">Recommendations</h3>
          </div>
          <div className="p-6 md:p-8">
            <ul className="space-y-4">
              {selectedReport.recommendations && selectedReport.recommendations.length > 0 ? (
                selectedReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">{rec}</p>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex gap-4 items-start">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Engage in daily word puzzles or memory games to strengthen cognitive neural pathways.
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Maintain a consistent sleep schedule of 7-9 hours to support optimal cognitive function and recovery.
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Incorporate light physical activity, such as a 30-minute brisk walk, into your daily routine for better brain oxygenation.
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      Re-assess in 6 months to monitor trends and evaluate the impact of these lifestyle interventions.
                    </p>
                  </li>
                </>
              )}
            </ul>
          </div>
        </section>

      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-6 py-4 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to dashboard</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF report</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
