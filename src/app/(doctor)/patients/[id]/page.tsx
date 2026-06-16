"use client";

import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { usePatient } from "@/hooks/usePatient";
import { useReport } from "@/hooks/useReport";
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";
import CopyLinkButton from "@/components/patient/CopyLinkButton";
import Link from "next/link";
import Avatar from "@/components/shared/Avatar";
import { Calendar, ChevronLeft, FileText, Phone, Mail, Award, TrendingUp } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { selectedPatient, fetchPatientById, isLoading, error } = usePatient();
  const { reports, fetchReports } = useReport();

  useEffect(() => {
    if (id) {
      fetchPatientById(id as string);
      fetchReports();
    }
  }, [id, fetchPatientById, fetchReports]);

  if (isLoading) {
    return <LoadingScreen message="Fetching patient historical details..." />;
  }

  if (error || !selectedPatient) {
    return (
      <div className="p-6">
        <ErrorState
          title="Record Not Found"
          message={error || "Could not find a patient record matching the provided identifier."}
          retryAction={() => id && fetchPatientById(id as string)}
        />
      </div>
    );
  }

  // Filter reports specifically for this patient
  const patientReports = reports.filter((r) => r.patientId === selectedPatient.id);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Back breadcrumb */}
      <button
        onClick={() => router.push("/patients")}
        className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors mb-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Patients List</span>
      </button>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start pb-6 border-b border-border-default">
        <div className="flex items-center gap-4">
          <Avatar name={selectedPatient.name} className="h-14 w-14 border-2 border-brand-primary/20" />
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
              {selectedPatient.name}
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-0.5">
              Medical ID: {selectedPatient.medicalId} · Status: <StatusBadge status={selectedPatient.status} className="ml-1" />
            </p>
          </div>
        </div>
        <div className="shrink-0 flex flex-wrap gap-2">
          <CopyLinkButton token={selectedPatient.assessmentToken} />
        </div>
      </div>

      {/* Split details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Demographics card */}
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-border-default pb-2">
              Demographic Details
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-on-surface-variant">Age:</span>
                <span className="text-on-surface">{selectedPatient.age} years</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-on-surface-variant">Gender:</span>
                <span className="text-on-surface">{selectedPatient.gender}</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-on-surface-variant">Email:</span>
                <span className="text-on-surface flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-brand-primary/70" />
                  {selectedPatient.email}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-on-surface-variant">Phone:</span>
                <span className="text-on-surface flex items-center gap-1 font-mono">
                  <Phone className="h-3.5 w-3.5 text-brand-primary/70" />
                  {selectedPatient.phone}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-on-surface-variant">Clinician:</span>
                <span className="text-on-surface">{selectedPatient.doctorName}</span>
              </div>
            </div>
          </div>

          {/* Reports History listing */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-border-default pb-2">
              Diagnostic Reports ({patientReports.length})
            </h3>
            
            {patientReports.length > 0 ? (
              <div className="space-y-2">
                {patientReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/reports?id=${report.id}`}
                    className="flex justify-between items-center p-3 rounded-xl border border-border-default bg-surface-muted/30 hover:bg-surface-muted transition-colors font-bold text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-brand-primary" />
                      <div>
                        <p className="text-on-surface">{report.reportId}</p>
                        <p className="text-[10px] text-on-surface-variant/80 font-medium">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-brand-secondary">{report.totalScore}%</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant font-medium text-center py-4">
                No reports generated yet for this patient.
              </p>
            )}
          </div>
        </div>

        {/* Right column: Trends charts and details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cognitive score chart card */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-brand-primary" />
                Cognitive Trend Index
              </h3>
            </div>

            {selectedPatient.scoresHistory && selectedPatient.scoresHistory.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedPatient.scoresHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: "bold", fill: "#434655" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: "bold", fill: "#434655" }} />
                    <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "12px", border: "1px solid #E2E8F0" }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      name="Overall Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col justify-center items-center text-center p-6 border border-dashed border-border-default rounded-xl bg-surface-muted/20">
                <TrendingUp className="h-8 w-8 text-on-surface-variant/40 mb-2" />
                <p className="text-xs text-on-surface-variant font-medium">
                  At least 2 assessment scores are required to display tracking trends.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(PatientDetailPage);
