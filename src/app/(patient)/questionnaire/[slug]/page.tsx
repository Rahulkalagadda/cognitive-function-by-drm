"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/hooks/useAssessment";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { useQuestionnaireStore } from "@/stores/questionnaire.store";
import { CLINICAL_QUESTIONNAIRES, getMixedQuestionnaire } from "@/lib/questionnaires";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ErrorState from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { toastSuccess } from "@/lib/toast";
import { ArrowLeft, ArrowRight, Check, Lock, Circle } from "lucide-react";
import { QuestionnaireSlug } from "@/types/questionnaire.types";
import { cn } from "@/lib/utils";

// Localized category badges mapping
const badgeLabels: Record<string, Record<string, string>> = {
  "phq-9": {
    en: "Depression screening",
    hi: "अवसाद स्क्रीनिंग",
    mr: "नैराश्य स्क्रीनिंग",
    te: "డిప్రెషన్ స్క్రీనింగ్"
  },
  "gad-7": {
    en: "Anxiety screening",
    hi: "चिंता स्क्रीनिंग",
    mr: "चिंता स्क्रीनिंग",
    te: "ఆందోళన స్క్రీనింగ్"
  },
  "araq": {
    en: "ADHD Avoidance & Anxiety screening",
    hi: "ADHD बचाव और चिंता स्क्रीनिंग",
    mr: "ADHD टाळणे आणि चिंता स्क्रीनिंग",
    te: "ADHD నివారణ & ఆందోళన స్క్రీనింగ్"
  },
  "mixed": {
    en: "Clinical Questionnaire",
    hi: "स्वास्थ्य प्रश्नावली",
    mr: "आरोग्य प्रश्नावली",
    te: "ఆరోగ్య ప్రశ్నావళి"
  }
};

export default function QuestionnairePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as QuestionnaireSlug;
  const token = searchParams.get("token");

  const { currentSession, loadSession, isLoading, error, language, submitResponse } = useAssessment();
  const { responses: storeResponses, submitAnswer, totalScore: storeTotalScore } = useQuestionnaire(slug);
  const [mixedAnswers, setMixedAnswers] = useState<Record<string, number>>({});
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      loadSession(token);
    }
  }, [token, loadSession]);

  useEffect(() => {
    if (mounted && slug !== "mixed" && token) {
      router.replace(`/questionnaire/mixed?token=${token}`);
    }
  }, [mounted, slug, token, router]);

  if (!mounted || isLoading) {
    return <LoadingScreen message="Loading questionnaire items..." />;
  }

  if (error || !currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
        <ErrorState
          title="Session Load Error"
          message={error || "Invalid assessment session. Verify URL."}
          retryAction={() => token && loadSession(token)}
        />
      </div>
    );
  }

  const langCode = language || "en";
  const mixedData = getMixedQuestionnaire(langCode);
  const questionnaireData = slug === "mixed"
    ? mixedData
    : (CLINICAL_QUESTIONNAIRES[langCode]?.[slug] || CLINICAL_QUESTIONNAIRES["en"]?.[slug]);

  if (!questionnaireData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
        <ErrorState
          title="Questionnaire Load Error"
          message="Could not load the requested questionnaire content."
        />
      </div>
    );
  }

  const items = questionnaireData.items;
  const answeredCount = slug === "mixed"
    ? Object.keys(mixedAnswers).length
    : items.filter((item) => storeResponses[item.id] !== undefined).length;
  const totalQuestions = items.length;
  const isAllAnswered = answeredCount === totalQuestions;

  // Visual specifications based on slug
  let sectionIndexText = "Screening Questionnaires";
  let screeningTitleText = "Clinical Health Questionnaire";
  let overallProgressPercent = 5;
  let cardClass = "border border-border-default bg-white";
  let badgeClass = "bg-[#eff4ff] text-[#004ac6] ring-1 ring-inset ring-[#004ac6]/10";
  let selectedPillClass = "bg-[#2563EB] text-white border-[#2563EB]";
  let unselectedPillHoverClass = "hover:border-[#2563EB]";
  let themeButtonClass = "bg-[#2563EB] hover:bg-[#2563EB]/95 text-white shadow-[#2563EB]/25";
  let timelineColorClass = "bg-[#2563EB]";

  if (slug === "gad-7") {
    sectionIndexText = "Section 2 of 3 · Questionnaires";
    screeningTitleText = "GAD-7 Anxiety Screening";
    overallProgressPercent = 12;
    cardClass = "border border-border-default border-l-4 border-[#0D9488] bg-white";
    badgeClass = "bg-[#0d9488]/10 text-[#006a61] ring-1 ring-inset ring-[#0D9488]/10";
    selectedPillClass = "bg-[#0D9488] text-white border-[#0D9488]";
    unselectedPillHoverClass = "hover:border-[#0D9488]";
    themeButtonClass = "bg-[#0D9488] hover:bg-[#0D9488]/95 text-white shadow-[#0D9488]/25";
    timelineColorClass = "bg-[#0D9488]";
  } else if (slug === "araq") {
    sectionIndexText = "Section 3 of 3 · Questionnaires";
    screeningTitleText = "ARAQ ADHD Avoidance & Anxiety";
    overallProgressPercent = 20;
    cardClass = "border border-border-default border-l-4 border-[#F59E0B] bg-white";
    badgeClass = "bg-[#ffdbcd]/30 text-[#943700] ring-1 ring-inset ring-[#F59E0B]/10";
    selectedPillClass = "bg-[#F59E0B] text-white border-[#F59E0B]";
    unselectedPillHoverClass = "hover:border-[#F59E0B]";
    themeButtonClass = "bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white shadow-[#F59E0B]/25";
    timelineColorClass = "bg-[#F59E0B]";
  }

  const handleOptionSelect = (itemId: string, value: number) => {
    if (slug === "mixed") {
      setMixedAnswers((prev) => ({ ...prev, [itemId]: value }));
    } else {
      submitAnswer(itemId, value);
    }
    setUnanswered((prev) => prev.filter((id) => id !== itemId));
  };

  const handleNext = async () => {
    const missing = items
      .filter((item) => (slug === "mixed" ? mixedAnswers[item.id] === undefined : storeResponses[item.id] === undefined))
      .map((item) => item.id);

    if (missing.length > 0) {
      setUnanswered(missing);
      toastSuccess("Incomplete Section", "Please answer all questions before proceeding.");
      return;
    }

    if (slug === "mixed") {
      // Split responses into phq-9, gad-7, and araq
      const phqAnswers: Record<string, number> = {};
      const gadAnswers: Record<string, number> = {};
      const araqAnswers: Record<string, number> = {};

      Object.entries(mixedAnswers).forEach(([key, val]) => {
        if (key.startsWith("phq_")) {
          phqAnswers[key.replace("phq_", "")] = val;
        } else if (key.startsWith("gad_")) {
          gadAnswers[key.replace("gad_", "")] = val;
        } else if (key.startsWith("araq_")) {
          araqAnswers[key.replace("araq_", "")] = val;
        }
      });

      const phqTotal = Object.values(phqAnswers).reduce((sum, v) => sum + v, 0);
      const gadTotal = Object.values(gadAnswers).reduce((sum, v) => sum + v, 0);
      const araqTotal = Object.values(araqAnswers).reduce((sum, v) => sum + v, 0);

      // Submit results to Zustand store to track session progress
      submitResponse(0, {
        questionnaire: "phq-9",
        responses: phqAnswers,
        score: phqTotal
      });
      submitResponse(1, {
        questionnaire: "gad-7",
        responses: gadAnswers,
        score: gadTotal
      });
      submitResponse(2, {
        questionnaire: "araq",
        responses: araqAnswers,
        score: araqTotal
      });

      // Mark questionnaires as completed in the store
      const { submitQuestionnaire } = useQuestionnaireStore.getState();
      submitQuestionnaire("phq-9");
      submitQuestionnaire("gad-7");
      submitQuestionnaire("araq");

      // Submit API calls sequentially
      try {
        const { submitQuestionnaireResponse } = await import("@/services/api/assessments.service");
        
        await submitQuestionnaireResponse(
          currentSession.id,
          "phq-9",
          language || "en",
          phqAnswers,
          phqTotal,
          9
        );

        await submitQuestionnaireResponse(
          currentSession.id,
          "gad-7",
          language || "en",
          gadAnswers,
          gadTotal,
          7
        );

        await submitQuestionnaireResponse(
          currentSession.id,
          "araq",
          language || "en",
          araqAnswers,
          araqTotal,
          26
        );
      } catch (err) {
        console.error("Failed to submit questionnaire responses:", err);
      }

      router.push(`/start?token=${token}`);
      return;
    }

    // Submit results to Zustand assessment responses (use stepIndex dynamically or map to slug index)
    let targetStepIndex = 0;
    if (slug === "gad-7") targetStepIndex = 1;
    if (slug === "araq") targetStepIndex = 2;

    submitResponse(targetStepIndex, {
      questionnaire: slug,
      responses: storeResponses,
      score: storeTotalScore
    });

    // Also mark this questionnaire as completed in the store
    const { submitQuestionnaire } = useQuestionnaireStore.getState();
    submitQuestionnaire(slug);

    try {
      const { submitQuestionnaireResponse } = await import("@/services/api/assessments.service");
      await submitQuestionnaireResponse(
        currentSession.id,
        slug,
        language || "en",
        storeResponses,
        storeTotalScore,
        totalQuestions
      );
    } catch (err) {
      console.error("Failed to submit questionnaire responses:", err);
    }

    // Advance sequentially
    if (slug === "phq-9") {
      router.push(`/questionnaire/gad-7?token=${token}`);
    } else if (slug === "gad-7") {
      router.push(`/questionnaire/araq?token=${token}`);
    } else if (slug === "araq") {
      router.push(`/start?token=${token}`);
    }
  };

  const handleBack = () => {
    if (slug === "mixed") {
      router.push(`/assessment/${token}`);
      return;
    }
    if (slug === "phq-9") {
      router.push(`/assessment/${token}`);
    } else if (slug === "gad-7") {
      router.push(`/questionnaire/phq-9?token=${token}`);
    } else if (slug === "araq") {
      router.push(`/questionnaire/gad-7?token=${token}`);
    }
  };

  // Completion statuses for the timeline
  const completedTimeline = {
    "phq-9": slug !== "phq-9",
    "gad-7": slug === "araq",
    "araq": false
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* Interactive Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-border-default h-16 flex items-center px-4 sm:px-6">
        <div className="flex justify-between items-center w-full max-w-5xl mx-auto gap-4">
          {/* Left: Context */}
          <div className="flex-1 flex flex-col text-left">
            <span className="text-[10px] text-on-surface-variant/80 font-bold uppercase tracking-wider">
              {sectionIndexText}
            </span>
          </div>

          {/* Center: Progress Bar */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-32 sm:w-48 h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500 rounded-full", timelineColorClass)}
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-extrabold text-on-surface-variant/70 uppercase tracking-widest">
              {overallProgressPercent}% Overall Progress
            </span>
          </div>

          {/* Right: Title */}
          <div className="flex-1 text-right">
            <span className="text-xs sm:text-sm font-black text-on-surface uppercase tracking-wider hidden sm:inline-block">
              {screeningTitleText}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-8 pb-32 px-4 flex flex-col items-center">
        
        {/* Questionnaire Card */}
        <section
          className={cn(
            "w-full max-w-[600px] rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6 transition-all duration-300",
            cardClass
          )}
        >
          {/* Card Header */}
          <header className="flex flex-col gap-3.5 border-b border-border-default/50 pb-5">
            <div>
              <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider", badgeClass)}>
                {badgeLabels[slug]?.[langCode] || badgeLabels[slug]?.en}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-on-surface leading-relaxed">
              {questionnaireData.description}
            </h1>
          </header>

          {/* Question List */}
          <div className="flex flex-col gap-8 divide-y divide-border-default/40">
            {items.map((item, index) => {
              const isError = unanswered.includes(item.id);
              const selectedValue = slug === "mixed" ? mixedAnswers[item.id] : storeResponses[item.id];

              return (
                <div key={item.id} className={cn("flex flex-col gap-4 transition-all", index > 0 && "pt-6")}>
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-bold text-on-surface leading-relaxed flex items-start gap-2",
                      isError && "text-status-error"
                    )}
                  >
                    <span className="font-extrabold text-brand-primary">{index + 1}.</span>
                    <span>{item.text}</span>
                  </p>

                  {/* Option Pill Buttons */}
                  <div
                    className={cn(
                      (slug as string) === "pss-10" || slug === "mixed" || item.options.length > 4
                        ? "flex flex-wrap gap-2"
                        : "grid grid-cols-2 md:grid-cols-4 gap-2"
                    )}
                  >
                    {item.options.map((opt: any) => {
                      const isSelected = selectedValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleOptionSelect(item.id, opt.value)}
                          className={cn(
                            "px-4 py-2.5 rounded-full border text-[11px] font-extrabold text-center transition-all duration-200 active:scale-95",
                            isSelected
                              ? selectedPillClass
                              : cn(
                                  "border-border-default bg-white text-on-surface-variant hover:bg-surface-page hover:text-on-surface",
                                  unselectedPillHoverClass
                                )
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidential Footer Note */}
          <footer className="mt-4 pt-5 border-t border-border-default/50 flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5 text-on-surface-variant/60" />
            <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">
              Your answers are private and confidential
            </p>
          </footer>
        </section>

        {/* Bottom Completion Preview Strip */}
        {slug !== "mixed" ? (
          <div className="mt-10 flex items-center justify-center gap-6 select-none">
            {/* PHQ-9 */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                  completedTimeline["phq-9"]
                    ? "bg-brand-secondary border-brand-secondary text-white"
                    : slug === "phq-9"
                    ? "border-[#2563EB] ring-4 ring-[#2563EB]/25"
                    : "bg-surface-card border-border-default text-on-surface-variant/40"
                )}
              >
                {completedTimeline["phq-9"] ? (
                  <Check className="h-4.5 w-4.5 stroke-[3px]" />
                ) : (
                  <span className={cn("text-xs font-black", slug === "phq-9" ? "text-[#2563EB]" : "text-on-surface-variant/40")}>
                    1
                  </span>
                )}
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wider uppercase", slug === "phq-9" ? "text-[#2563EB]" : "text-on-surface-variant/50")}>
                PHQ-9
              </span>
            </div>

            <div className="h-px w-8 bg-border-default" />

            {/* GAD-7 */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                  completedTimeline["gad-7"]
                    ? "bg-brand-secondary border-brand-secondary text-white"
                    : slug === "gad-7"
                    ? "border-[#0D9488] ring-4 ring-[#0D9488]/25"
                    : "bg-surface-card border-border-default text-on-surface-variant/40"
                )}
              >
                {completedTimeline["gad-7"] ? (
                  <Check className="h-4.5 w-4.5 stroke-[3px]" />
                ) : (
                  <span className={cn("text-xs font-black", slug === "gad-7" ? "text-[#0D9488]" : "text-on-surface-variant/40")}>
                    2
                  </span>
                )}
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wider uppercase", slug === "gad-7" ? "text-[#0D9488]" : "text-on-surface-variant/50")}>
                GAD-7
              </span>
            </div>

            <div className="h-px w-8 bg-border-default" />

            {/* ARAQ */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm",
                  slug === "araq"
                    ? "border-[#F59E0B] ring-4 ring-[#F59E0B]/25"
                    : "bg-surface-card border-border-default text-on-surface-variant/40"
                )}
              >
                <span className={cn("text-xs font-black", slug === "araq" ? "text-[#F59E0B]" : "text-on-surface-variant/40")}>
                  3
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wider uppercase", slug === "araq" ? "text-[#F59E0B]" : "text-on-surface-variant/50")}>
                ARAQ
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-1 select-none">
            <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest text-center">
              Please answer all questions honestly. Your data is secure and confidential.
            </span>
          </div>
        )}
      </main>

      {/* Sticky Bottom Footer Navigation */}
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-border-default py-4 px-4 sm:px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] h-20 flex items-center">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          {/* Back button */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={handleBack}
              type="button"
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-brand-primary font-extrabold text-xs py-2 px-4 rounded-lg hover:bg-surface-page transition-colors cursor-pointer select-none active:scale-95 duration-150"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Question Progress Text */}
          <div className="flex-1 text-center">
            <span className="text-on-surface-variant/90 font-extrabold text-[11px] bg-surface-page border border-border-default/50 px-3.5 py-1.5 rounded-full select-none">
              {answeredCount} of {totalQuestions} {slug === "araq" ? "questions" : ""}
            </span>
          </div>

          {/* Next button */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleNext}
              type="button"
              disabled={!isAllAnswered}
              className={cn(
                "flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-extrabold shadow-sm transition-all duration-150 select-none",
                isAllAnswered
                  ? cn(themeButtonClass, "cursor-pointer active:scale-95")
                  : "bg-surface-muted border border-border-default text-on-surface-variant/40 opacity-50 cursor-not-allowed"
              )}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
