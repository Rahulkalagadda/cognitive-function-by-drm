import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: "primary" | "warning" | "success" | "info" | "tertiary";
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "primary",
  className
}: StatCardProps) {
  
  const colors = {
    primary: {
      bg: "bg-brand-primary/10",
      text: "text-brand-primary",
      badge: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    },
    warning: {
      bg: "bg-status-pending/10",
      text: "text-status-pending",
      badge: "bg-status-pending/10 text-status-pending border-status-pending/20",
    },
    success: {
      bg: "bg-status-complete/10",
      text: "text-status-complete",
      badge: "bg-status-complete/10 text-status-complete border-status-complete/20",
    },
    info: {
      bg: "bg-status-info/10",
      text: "text-status-info",
      badge: "bg-status-info/10 text-status-info border-status-info/20",
    },
    tertiary: {
      bg: "bg-brand-accent/10",
      text: "text-brand-accent",
      badge: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    }
  };

  const scheme = colors[variant];

  return (
    <div className={cn(
      "p-5 bg-surface-card rounded-2xl border border-border-default shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border-strong group",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", scheme.bg)}>
          <Icon className={cn("h-5 w-5", scheme.text)} />
        </div>
        <span className={cn("text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border", scheme.badge)}>
          {title}
        </span>
      </div>
      <div className="text-3xl font-extrabold text-on-surface tracking-tight mb-0.5">
        {value}
      </div>
      <div className="text-xs text-on-surface-variant font-medium">
        {description}
      </div>
    </div>
  );
}
