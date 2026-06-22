"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { usePatient } from "@/hooks/usePatient";
import Avatar from "@/components/shared/Avatar";
import {
  ClipboardList,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Link2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { regenerateAssessmentLink } from "@/services/api/patients.service";

interface GeneratedLink {
  link: string;
  token: string;
  generatedAt: Date;
}

function DoctorAssessmentsPage() {
  const { patients, fetchPatients, isLoading } = usePatient();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Reset generated link when patient selection changes
  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setGeneratedLink(null);
    setGenerateError(null);
    setCopied(false);
  };

  const handleGenerateLink = async () => {
    if (!selectedPatientId) return;
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedLink(null);
    setCopied(false);

    const result = await regenerateAssessmentLink(selectedPatientId);
    if (result) {
      setGeneratedLink({ ...result, generatedAt: new Date() });
    } else {
      setGenerateError("Failed to generate a new assessment link. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = generatedLink.link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading && patients.length === 0) {
    return <LoadingScreen message="Loading patient database..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Assessment Hub"
        description="Select a registered patient and generate a fresh, valid assessment link to share with them."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Generator Panel */}
        <div className="lg:col-span-2 space-y-4">

          {/* Active Template */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
              Active Assessment Template
            </h3>
            <div className="p-4 rounded-xl border-2 border-brand-primary/20 bg-brand-primary/5 flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-brand-primary">
                  <ClipboardList className="h-4 w-4" />
                  <span>Standard Cognitive Battery</span>
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  5 Domains (Attention, Memory, Reasoning, Coordination, Perception) · ~2.5 mins
                </p>
              </div>
              <span className="px-2.5 py-1 bg-brand-primary text-white text-[9px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                Default
              </span>
            </div>
          </div>

          {/* Generate Link Panel */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-5">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
              Generate Assessment Link
            </h3>

            {/* Patient Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Select Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-bold transition-all"
              >
                <option value="">— Choose a patient —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.medicalId}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Preview */}
            {activePatient && (
              <div className="p-4 bg-surface-muted/40 rounded-xl border border-border-default flex items-center gap-4 animate-fadeIn">
                <Avatar name={activePatient.name} className="h-10 w-10 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-on-surface truncate">{activePatient.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                    ID: {activePatient.medicalId} · Status: <span className="capitalize">{activePatient.status}</span>
                  </p>
                </div>
                <div className="ml-auto shrink-0">
                  <button
                    onClick={handleGenerateLink}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-60 text-white rounded-xl shadow-md shadow-brand-primary/20 text-xs font-extrabold transition-all active:scale-95 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Generating…</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" />
                        <span>{generatedLink ? "Regenerate" : "Generate Link"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {generateError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {generateError}
              </div>
            )}

            {/* Generated Link Result */}
            {generatedLink && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                    Link Generated Successfully
                  </span>
                </div>

                {/* Link box */}
                <div className="relative flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <code className="text-[10px] font-mono text-emerald-800 break-all flex-1 pr-2 select-all">
                    {generatedLink.link}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-extrabold transition-all ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Validity info */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Generated at {generatedLink.generatedAt.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>Valid for 30 days · Previous link is now invalid</span>
                  </div>
                </div>

                {/* Launch direct */}
                <a
                  href={generatedLink.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-brand-primary/30 hover:bg-brand-primary/5 text-brand-primary rounded-xl text-xs font-extrabold transition-all"
                >
                  <span>Open Assessment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Guidelines */}
        <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4 h-fit">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-border-default pb-2">
            Assessment Guidelines
          </h3>
          <div className="space-y-4 text-xs font-semibold text-on-surface-variant leading-relaxed">
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                Each generated link is unique to the patient and valid for{" "}
                <strong>30 days</strong>. Generating a new link immediately invalidates the previous one.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                Share the link via email, WhatsApp, or SMS. The patient logs in with their email or phone OTP.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                Ensure the patient takes the assessment on a stable touchscreen device or desktop.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                The memory recall task requires the patient to recall as many words as possible when prompted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(DoctorAssessmentsPage);
