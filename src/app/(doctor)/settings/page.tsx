"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Settings, Shield, Bell, User, Building } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

function DoctorSettingsPage() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <PageHeader
        title="Settings & System Configurations"
        description="Manage clinician credentials, hospital profiles, database configurations, and HIPAA parameters."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Category links */}
        <div className="space-y-2">
          {[
            { name: "My Profile", icon: User, active: true },
            { name: "Clinic Details", icon: Building },
            { name: "HIPAA Security", icon: Shield },
            { name: "Alerts & Notifications", icon: Bell }
          ].map((cat) => (
            <button
              key={cat.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                cat.active
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-surface-card text-on-surface-variant border-border-default hover:bg-surface-muted"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Form details */}
        <div className="md:col-span-2 bg-surface-card rounded-2xl border border-border-default p-6 shadow-card space-y-6">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-border-default pb-2">
            Clinician Profile Summary
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                  Clinical Name
                </label>
                <input
                  type="text"
                  defaultValue="Dr. Priya Sharma"
                  disabled
                  className="w-full px-4 py-2.5 border border-border-default bg-surface-page rounded-xl text-xs text-on-surface-variant font-bold cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                  Clinical Title / License
                </label>
                <input
                  type="text"
                  defaultValue="Senior Clinical Neuropsychologist (NL-84920)"
                  disabled
                  className="w-full px-4 py-2.5 border border-border-default bg-surface-page rounded-xl text-xs text-on-surface-variant font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Associated Medical Clinic
              </label>
              <input
                type="text"
                defaultValue="CogHealth diagnostics, Neuro-Science Division, Mumbai"
                disabled
                className="w-full px-4 py-2.5 border border-border-default bg-surface-page rounded-xl text-xs text-on-surface-variant font-bold cursor-not-allowed"
              />
            </div>
            
            <div className="p-4 bg-status-info/5 rounded-xl border border-status-info/15 text-xs text-on-surface-variant font-medium leading-relaxed">
              To update your medical registration details, hospital association, or reset clinical credentials, please contact the system administrator.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withErrorBoundary(DoctorSettingsPage);
