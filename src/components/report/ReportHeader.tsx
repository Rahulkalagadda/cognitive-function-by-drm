import React from "react";
import Logo from "../shared/Logo";
import { AssessmentReport } from "@/types/report.types";

interface ReportHeaderProps {
  report: AssessmentReport;
}

export default function ReportHeader({ report }: ReportHeaderProps) {
  return (
    <div className="space-y-6 select-none">
      {/* Top Brand Block */}
      <div className="flex justify-between items-center pb-4 border-b border-border-default">
        <Logo />
        <div className="text-center">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-primary">
            Cognitive Diagnostics
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">
            Report ID
          </p>
          <p className="text-xs font-extrabold text-on-surface">
            {report.reportId}
          </p>
        </div>
      </div>

      {/* Patients Info Grid */}
      <div className="grid grid-cols-2 gap-4 py-2 text-xs">
        <div className="space-y-2">
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Patient:</span>
            <span className="font-bold text-on-surface">{report.patientName}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Age / Sex:</span>
            <span className="font-bold text-on-surface">{report.patientAge} / {report.patientGender}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Phone:</span>
            <span className="font-bold text-on-surface">{report.patientPhone}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Report Date:</span>
            <span className="font-bold text-on-surface">
              {new Date(report.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Clinician:</span>
            <span className="font-bold text-on-surface">{report.clinicianName}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
            <span className="font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Assessment ID:</span>
            <span className="font-bold text-on-surface font-mono">{report.assessmentId}</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-border-default w-full"></div>
    </div>
  );
}
