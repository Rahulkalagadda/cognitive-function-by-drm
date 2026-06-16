import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Calendar, UserCheck, Play } from "lucide-react";

interface Activity {
  id: string;
  type: "complete" | "critical" | "schedule" | "update" | "testing";
  message: string;
  time: string;
  patientName: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "complete",
    message: "completed cognitive assessment",
    time: "2 hours ago",
    patientName: "Sunita Mehta"
  },
  {
    id: "act-2",
    type: "critical",
    message: "scored below average (42% critical limit)",
    time: "1 day ago",
    patientName: "Ravi Kumar"
  },
  {
    id: "act-3",
    type: "schedule",
    message: "was scheduled for reasoning task",
    time: "1 day ago",
    patientName: "Arjun Bansal"
  },
  {
    id: "act-4",
    type: "testing",
    message: "started taking coordinates validation test",
    time: "2 days ago",
    patientName: "Sana Nair"
  },
  {
    id: "act-5",
    type: "update",
    message: "stable score threshold verified",
    time: "3 days ago",
    patientName: "Meera Patel"
  }
];

export default function RecentActivityFeed() {
  const icons = {
    complete: <CheckCircle className="h-4 w-4 text-status-complete" />,
    critical: <AlertTriangle className="h-4 w-4 text-status-error" />,
    schedule: <Calendar className="h-4 w-4 text-status-pending" />,
    testing: <Play className="h-4 w-4 text-status-info" />,
    update: <UserCheck className="h-4 w-4 text-brand-secondary" />
  };

  const bgStyles = {
    complete: "bg-status-complete/10 text-status-complete border-status-complete/20",
    critical: "bg-status-error/10 text-status-error border-status-error/20",
    schedule: "bg-status-pending/10 text-status-pending border-status-pending/20",
    testing: "bg-status-info/10 text-status-info border-status-info/20",
    update: "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-4">
        Recent Activity Feed
      </h3>
      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex gap-3 items-start text-sm group">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105", bgStyles[activity.type])}>
              {icons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-on-surface font-semibold text-xs truncate">
                {activity.patientName}{" "}
                <span className="text-on-surface-variant font-medium">
                  {activity.message}
                </span>
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
