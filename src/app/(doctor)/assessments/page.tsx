"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { usePatient } from "@/hooks/usePatient";
import CopyLinkButton from "@/components/patient/CopyLinkButton";
import Avatar from "@/components/shared/Avatar";
import { ClipboardList, Play, ArrowRight, Sparkles } from "lucide-react";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function DoctorAssessmentsPage() {
  const { patients, fetchPatients, isLoading } = usePatient();
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const activePatient = patients.find(p => p.id === selectedPatientId);

  if (isLoading && patients.length === 0) {
    return <LoadingScreen message="Loading templates database..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Assessment Hub"
        description="Select a registered patient to copy or launch their individual assessment portal sessions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Selector list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
              Active Assessment Templates
            </h3>

            {/* Template Card */}
            <div className="p-4 rounded-xl border-2 border-brand-primary/20 bg-brand-primary/5 flex justify-between items-center group shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-brand-primary">
                  <ClipboardList className="h-4 w-4" />
                  <span>Standard Cognitive Battery</span>
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  5 Domains (Attention, Memory, Reasoning, Coordination, Perception) · Total Time: ~2.5 mins
                </p>
              </div>
              <span className="px-2.5 py-1 bg-brand-primary text-white text-[9px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                Default
              </span>
            </div>
          </div>

          {/* Quick Launch Panel */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
              Launch Assessment Direct Link
            </h3>

            <div className="space-y-3">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Select Patient
              </label>
              
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-bold"
              >
                <option value="">-- Choose a patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.medicalId})
                  </option>
                ))}
              </select>
            </div>

            {activePatient && (
              <div className="p-4 bg-surface-muted/50 rounded-xl border border-border-default flex flex-col sm:flex-row gap-4 items-center justify-between mt-4 animate-fade-in">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Avatar name={activePatient.name} className="h-9 w-9 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-on-surface">{activePatient.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-semibold">
                      Token: <span className="font-mono">{activePatient.assessmentToken}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                  <CopyLinkButton token={activePatient.assessmentToken} />
                  <a
                    href={`/assessment/${activePatient.assessmentToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl shadow-md shadow-brand-primary/20 text-xs font-bold transition-all active:scale-95"
                  >
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information panel */}
        <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4 h-fit">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-border-default pb-2">
            Assessment Guidelines
          </h3>
          <div className="space-y-4 text-xs font-semibold text-on-surface-variant leading-relaxed">
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4.5 w-4.5 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                Ensure the patient takes the assessment on a stable touchscreen device or a desktop mouse setting.
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <Sparkles className="h-4.5 w-4.5 text-brand-secondary shrink-0 mt-0.5" />
              <p>
                The assessment includes a mock memory recall. Prompt patients to enter as many words as possible when prompted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(DoctorAssessmentsPage);
