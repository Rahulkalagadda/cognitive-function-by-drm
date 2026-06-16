import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-default bg-surface-card p-12 text-center shadow-card animate-fade-in">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-on-surface-variant mb-4">
        {icon || <Search className="h-6 w-6 text-brand-primary/60" />}
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-1">{title}</h3>
      <p className="max-w-xs text-sm text-on-surface-variant mb-6">{description}</p>
      {action}
    </div>
  );
}
