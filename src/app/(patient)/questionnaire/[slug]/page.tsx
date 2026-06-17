"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { CLINICAL_QUESTIONNAIRES } from "@/lib/questionnaires";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toastSuccess } from "@/lib/toast";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { QuestionnaireSlug } from "@/types/questionnaire.types";

export default function QuestionnairePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as QuestionnaireSlug;
  const token = searchParams.get("token");
  const stepStr = searchParams.get("step");
  const stepIndex = stepStr !== null ? parseInt(stepStr, 10) : 0;

  const { currentSession, loadSession, isLoading, error, language, submitResponse } = useAssessment();
  const { responses, submitAnswer, totalScore } = useQuestionnaire(slug);
  const [unanswered, setUnanswered] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  const langCode = language === "hi" ? "hi" : "en";
  const questionnaireData = CLINICAL_QUESTIONNAIRES[langCode]?.[slug] || CLINICAL_QUESTIONNAIRES["en"]?.[slug];

  if (isLoading || !questionnaireData) {
    return <LoadingScreen message="Loading questionnaire items..." />;
  }

  if (error || !currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorState
          title="Session Load Error"
          message={error || "Invalid assessment session. Verify URL."}
          retryAction={() => token && loadSession(token)}
        />
      </div>
    );
  }

  const items = questionnaireData.items;

  const handleOptionSelect = (itemId: string, value: number) => {
    submitAnswer(itemId, value);
    setUnanswered((prev) => prev.filter((id) => id !== itemId));
  };

  const handleNext = () => {
    const missing = items.filter((item) => responses[item.id] === undefined).map((item) => item.id);

    if (missing.length > 0) {
      setUnanswered(missing);
      toastSuccess("Incomplete Section", "Please answer all questions before proceeding.");
      return;
    }

    // Submit results to Zustand assessment responses
    // Key by the slug
    submitResponse(stepIndex, {
      questionnaire: slug,
      responses,
      score: totalScore
    });

    // Advance to next step in the session
    const nextIndex = stepIndex + 1;
    if (nextIndex >= currentSession.steps.length) {
      router.push(`/complete?token=${token}`);
    } else {
      const nextStep = currentSession.steps[nextIndex];
      const taskId = nextStep.domain.toLowerCase();
      router.push(`/instructions/${taskId}?token=${token}&step=${nextIndex}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Questionnaire Header Card */}
      <Card className="border border-border-default shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className={`h-2.5 bg-brand-primary`} />
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-extrabold text-[#1E293B] tracking-tight">
            {questionnaireData.title}
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-on-surface-variant leading-relaxed mt-1.5">
            {questionnaireData.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Questionnaire Items List */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const isError = unanswered.includes(item.id);
          const selectedValue = responses[item.id];

          return (
            <Card
              key={item.id}
              className={`border rounded-xl transition-all duration-200 overflow-hidden bg-white shadow-sm ${
                isError ? "border-status-error/40 ring-1 ring-status-error/10" : "border-border-default"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex gap-3">
                  <span className="text-xs font-black text-brand-primary mt-0.5">
                    {index + 1}.
                  </span>
                  <p className="text-xs md:text-sm font-bold text-on-surface leading-relaxed">
                    {item.text}
                  </p>
                </div>

                {/* Response Option Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {item.options.map((opt) => {
                    const isSelected = selectedValue === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleOptionSelect(item.id, opt.value)}
                        className={`px-3 py-3 border text-center rounded-lg text-[11px] font-bold transition-all active:scale-[0.97] flex flex-col justify-center items-center h-16 ${
                          isSelected
                            ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm"
                            : "border-border-default bg-surface-page text-on-surface-variant hover:bg-surface-muted/50 hover:text-on-surface"
                        }`}
                      >
                        <span className="leading-tight">{opt.label}</span>
                        <span className="text-[10px] opacity-65 mt-1 font-mono">{opt.value} pts</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Step Action Button */}
      <button
        onClick={handleNext}
        className="w-full h-14 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-lg shadow-brand-primary/20 rounded-xl text-sm font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
      >
        <span>Continue Assessment</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
