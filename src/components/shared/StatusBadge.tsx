import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();
  
  let styles = "bg-surface-muted text-on-surface-variant";
  
  if (normStatus === "complete" || normStatus === "stable" || normStatus === "done") {
    styles = "bg-status-complete/10 text-status-complete border-status-complete/20";
  } else if (normStatus === "pending" || normStatus === "scheduled") {
    styles = "bg-status-pending/10 text-status-pending border-status-pending/20";
  } else if (normStatus === "error" || normStatus === "critical") {
    styles = "bg-status-error/10 text-status-error border-status-error/20";
  } else if (normStatus === "info" || normStatus === "testing") {
    styles = "bg-status-info/10 text-status-info border-status-info/20";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-transparent transition-colors",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
}
