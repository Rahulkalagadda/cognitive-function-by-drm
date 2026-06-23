"use client";

import React from "react";
import { useQuestionnaireStore } from "@/stores/questionnaire.store";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export default function QuestionnaireProgress({ token }: { token?: string }) {
  const completed = useQuestionnaireStore((state) => state.completed);

  const surveys = [
    { slug: "phq-9", name: "PHQ-9 Depression Screener", color: "text-brand-primary" },
    { slug: "gad-7", name: "GAD-7 Anxiety Screener", color: "text-brand-secondary" },
    { slug: "araq", name: "ARAQ ADHD Avoidance & Anxiety", color: "text-brand-amber" }
  ];

  return (
    <div className="bg-white border border-border-default rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
        Assigned Patient Questionnaires
      </h3>

      <div className="space-y-3">
        {surveys.map((survey) => {
          const isDone = completed[survey.slug as "phq-9" | "gad-7" | "araq"];
          return (
            <div
              key={survey.slug}
              className="flex items-center justify-between p-3 bg-surface-page border border-border-default rounded-xl transition-all hover:bg-surface-muted/30"
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-[#10B981] fill-[#10B981]/10 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-on-surface-variant/40 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-on-surface">{survey.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    {isDone ? "Completed and submitted" : "Pending completion"}
                  </p>
                </div>
              </div>

              {!isDone && token && (
                <Link
                  href={`/questionnaire/${survey.slug}?token=${token}`}
                  className="text-[10px] font-extrabold text-brand-primary border border-brand-primary/25 bg-brand-primary/5 hover:bg-brand-primary/10 px-3.5 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Start Survey
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
