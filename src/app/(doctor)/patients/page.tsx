"use client";

import React, { useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { usePatient } from "@/hooks/usePatient";
import Link from "next/link";
import { Plus } from "lucide-react";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import PatientTable from "@/components/doctor/PatientTable";

function PatientsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-border-strong rounded-lg" />
          <div className="h-4 w-96 bg-border-default rounded-md" />
        </div>
        <div className="h-10 w-36 bg-border-default rounded-xl shrink-0" />
      </div>
      <div className="h-96 bg-white rounded-2xl border border-border-default shadow-card" />
    </div>
  );
}

function PatientsPage() {
  const { patients, fetchPatients, isLoading } = usePatient();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  if (isLoading) {
    return <PatientsSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Patients List"
        description="Search, view profile metrics and send direct assessment links to patients."
        actions={
          <Link
            href="/patients/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl shadow-md shadow-brand-primary/20 text-xs font-bold transition-all active:scale-95 shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Patient</span>
          </Link>
        }
      />

      <PatientTable data={patients} />
    </div>
  );
}

export default withErrorBoundary(PatientsPage);
