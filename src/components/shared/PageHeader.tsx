import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b border-border-default mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight bg-gradient-to-r from-on-surface to-on-surface-variant bg-clip-text">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
