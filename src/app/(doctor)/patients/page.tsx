"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { usePatient } from "@/hooks/usePatient";
import Avatar from "@/components/shared/Avatar";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

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

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white rounded-2xl border border-border-default p-4 shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <div className="h-9 w-full bg-border-default rounded-xl" />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-16 bg-border-default rounded-xl" />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-default shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-surface-muted/50">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <th key={i} className="py-4 px-6">
                    <div className="h-3 w-16 bg-border-strong rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-border-default rounded-full" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-24 bg-border-strong rounded-md" />
                        <div className="h-2.5 w-32 bg-border-default rounded-md" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-16 bg-border-default rounded-md font-mono" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-12 bg-border-default rounded-md" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-24 bg-border-default rounded-md" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-5 w-16 bg-border-default rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-3.5 w-20 bg-border-default rounded-md" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-8 w-24 bg-border-default rounded-xl ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PatientsPage() {
  const { patients, fetchPatients, isLoading } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter =
      statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

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

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-surface-card rounded-2xl border border-border-default p-4 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or email..."
            aria-label="Search patients by name, ID, or email"
            className="w-full pl-10 pr-4 py-2 border border-border-default rounded-xl text-xs bg-surface-page focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar shrink-0">
          {["all", "stable", "critical", "scheduled", "testing"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all active:scale-95 shrink-0 ${
                statusFilter === filter
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-surface-card text-on-surface-variant border-border-default hover:bg-surface-muted"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Table view */}
      <div className="bg-surface-card rounded-2xl border border-border-default shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-surface-muted/50 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-6">Medical ID</th>
                <th className="py-4 px-6">Age / Sex</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-xs font-bold">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.name} className="h-9 w-9 shrink-0" />
                        <div>
                          <p className="text-on-surface">{patient.name}</p>
                          <p className="text-[10px] text-on-surface-variant/80 font-medium">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface font-mono">
                      {patient.medicalId}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {patient.age} / {patient.gender}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-medium">
                      {patient.phone}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-medium">
                      {patient.lastAssessmentDate || "Never tested"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="text-[10px] font-extrabold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 px-3.5 py-2 rounded-xl transition-all active:scale-95 inline-block"
                      >
                        Open Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant font-medium">
                    No patients match your search or filter configuration.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(PatientsPage);
