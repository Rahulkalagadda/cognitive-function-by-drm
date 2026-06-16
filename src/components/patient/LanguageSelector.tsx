import React from "react";
import { useAssessmentStore } from "@/stores/assessment.store";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
  const { language, setLanguage } = useAssessmentStore();

  const languages = [
    { label: "English", code: "en" },
    { label: "हिंदी", code: "hi" },
    { label: "मराठी", code: "mr" },
    { label: "తెలుగు", code: "te" }
  ];

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
