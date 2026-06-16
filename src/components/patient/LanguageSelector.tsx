import React from "react";
import { useAssessmentStore } from "@/stores/assessment.store";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "buttons" | "dropdown";
}

export default function LanguageSelector({ variant = "buttons" }: LanguageSelectorProps) {
  const { language, setLanguage } = useAssessmentStore();

  const languages = [
    { label: "English", code: "en" },
    { label: "हिंदी", code: "hi" },
    { label: "मराठी", code: "mr" },
    { label: "తెలుగు", code: "te" }
  ];

  if (variant === "dropdown") {
    return (
      <div className="relative flex items-center gap-1.5 select-none">
        <Globe className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none bg-surface-card text-on-surface border border-border-default rounded-xl pl-2.5 pr-7 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer hover:bg-surface-muted/50 transition-colors shadow-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.4rem center',
            backgroundSize: '1.25rem',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-surface-card text-on-surface">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center py-2">
      {languages.map((lang) => {
        const isSelected = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-95 shadow-sm",
              isSelected
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-on-surface-variant border-border-default hover:bg-surface-muted"
            )}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
