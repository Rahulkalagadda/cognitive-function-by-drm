import React from "react";
import Link from "next/link";
import { UserPlus, BrainCircuit, BarChart3 } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/patients/create"
          className="flex flex-col items-center justify-center h-20 gap-2 bg-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/20 hover:bg-brand-primary/95 transition-all active:scale-95 text-center group"
        >
          <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-extrabold leading-tight">
            Create<br />Patient
          </span>
        </Link>
        <Link
          href="/assessments"
          className="flex flex-col items-center justify-center h-20 gap-2 border border-brand-secondary text-brand-secondary bg-brand-secondary/5 rounded-xl hover:bg-brand-secondary/10 transition-all active:scale-95 text-center group"
        >
          <BrainCircuit className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-extrabold leading-tight">
            New<br />Assessment
          </span>
        </Link>
        <Link
          href="/reports"
          className="flex flex-col items-center justify-center h-20 gap-2 border border-border-strong text-on-surface-variant bg-surface-muted/30 rounded-xl hover:bg-surface-muted transition-all active:scale-95 text-center group"
        >
          <BarChart3 className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-extrabold leading-tight">
            View<br />Reports
          </span>
        </Link>
      </div>
    </div>
  );
}
