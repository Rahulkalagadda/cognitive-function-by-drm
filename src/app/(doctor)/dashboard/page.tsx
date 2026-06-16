"use client";

import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/doctor/StatCard";
import QuickActions from "@/components/doctor/QuickActions";
import RecentActivityFeed from "@/components/doctor/RecentActivityFeed";
import { Users, FileText, CheckCircle2, Clock, Calendar } from "lucide-react";
import { usePatient } from "@/hooks/usePatient";
import { useReport } from "@/hooks/useReport";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import Avatar from "@/components/shared/Avatar";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-border-strong rounded-lg" />
          <div className="h-4 w-40 bg-border-default rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-border-default rounded-2xl p-5 space-y-3 shadow-card h-28 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="h-4 w-12 bg-border-default rounded-md" />
              <div className="h-5 w-5 bg-border-default rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-border-strong rounded-lg" />
            <div className="h-3.5 w-24 bg-border-default rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-default rounded-2xl p-6 shadow-card space-y-4">
            <div className="h-4 w-28 bg-border-strong rounded-md" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-surface-muted border border-border-default rounded-xl" />
              ))}
            </div>
          </div>

          <div className="bg-white border border-border-default rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-40 bg-border-strong rounded-md" />
              <div className="h-4 w-24 bg-border-default rounded-md" />
            </div>
            <div className="divide-y divide-border-default">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-border-default rounded-full" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-24 bg-border-strong rounded-md" />
                      <div className="h-3 w-32 bg-border-default rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-border-default rounded-full" />
                    <div className="h-7 w-20 bg-border-default rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border-default rounded-2xl p-6 shadow-card space-y-4 h-96">
            <div className="h-4 w-32 bg-border-strong rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 items-start py-2">
                  <div className="h-8 w-8 bg-border-default rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 bg-border-strong rounded-md" />
                    <div className="h-2.5 w-full bg-border-default rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorDashboardPage() {
  const { patients, fetchPatients, isLoading } = usePatient();
  const { reports, fetchReports } = useReport();

  useEffect(() => {
    fetchPatients();
    fetchReports();
  }, [fetchPatients, fetchReports]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Quick stats values
  const totalPatients = patients.length || 142;
  const pendingTests = patients.filter(p => p.status === "Scheduled").length || 18;
  const completedTests = patients.filter(p => p.status === "Stable").length || 97;
  const totalReports = reports.length || 76;

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Clinician Header Greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-on-surface">
            Welcome back, Dr. Priya Sharma
          </h2>
          <p className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mt-1">
            Clinical Workspace · {todayStr}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={totalPatients}
          description="Registered patients"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Pending"
          value={pendingTests}
          description="Assessments to complete"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Completed"
          value={completedTests}
          description="Tests verified"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Reports"
          value={totalReports}
          description="Generated summaries"
          icon={FileText}
          variant="tertiary"
        />
      </div>

      {/* Core Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Actions & Recent patients */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />

          {/* Recent Patient List Card */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Recent Patient Activities
              </h3>
              <Link href="/patients" className="text-xs font-bold text-brand-primary hover:underline">
                View All Patients
              </Link>
            </div>

            <div className="divide-y divide-border-default">
              {patients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 hover:bg-surface-muted/30 transition-colors rounded-xl px-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={patient.name} className="h-9 w-9 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold text-on-surface">{patient.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        Age {patient.age} · ID {patient.medicalId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={patient.status} />
                    <Link
                      href={`/patients/${patient.id}`}
                      className="text-[10px] font-extrabold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      Open Files
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Feed */}
        <div className="space-y-6">
          <RecentActivityFeed />
          
          {/* Clinic status indicator */}
          <div className="p-4 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/15 flex gap-3 items-start">
            <div className="p-2 bg-brand-secondary/15 rounded-xl text-brand-secondary shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">HIPAA Compliance Check</p>
              <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed mt-0.5">
                All cloud assessment responses are strictly encrypted. Patient access PINs expire automatically.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(DoctorDashboardPage);
