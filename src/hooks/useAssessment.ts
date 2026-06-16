import { useAssessmentStore } from "@/stores/assessment.store";

export function useAssessment() {
  const {
    currentSession,
    isLoading,
    error,
    language,
    loadSession,
    startSession,
    nextStep,
    prevStep,
    submitResponse,
    tickTimer,
    submitSession,
    setLanguage
  } = useAssessmentStore();

  return {
    currentSession,
    isLoading,
    error,
    language,
    loadSession,
    startSession,
    nextStep,
    prevStep,
    submitResponse,
    tickTimer,
    submitSession,
    setLanguage
  };
}
