import { create } from "zustand";
import { AssessmentSession, AssessmentStep } from "@/types/assessment.types";
import { getSessionByToken, submitAssessmentResponses } from "@/services/api/assessments.service";

interface AssessmentState {
  currentSession: AssessmentSession | null;
  isLoading: boolean;
  error: string | null;
  language: string;
  loadSession: (token: string) => Promise<void>;
  startSession: () => void;
  nextStep: () => void;
  prevStep: () => void;
  submitResponse: (stepIndex: number, response: any) => void;
  tickTimer: () => void;
  submitSession: () => Promise<string>;
  setLanguage: (lang: string) => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentSession: null,
  isLoading: false,
  error: null,
  language: "en",

  setLanguage: (lang) => set({ language: lang }),

  loadSession: async (token) => {
    const { currentSession } = get();
    if (currentSession && currentSession.token === token) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const session = await getSessionByToken(token);
      set({ currentSession: session, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load assessment", isLoading: false });
    }
  },

  startSession: () => {
    const { currentSession } = get();
    if (!currentSession) return;
    set({
      currentSession: {
        ...currentSession,
        status: "started",
        currentStepIndex: 0,
        timeRemainingSeconds: currentSession.steps[0].durationSeconds
      }
    });
  },

  nextStep: () => {
    const { currentSession } = get();
    if (!currentSession) return;
    const nextIndex = currentSession.currentStepIndex + 1;
    if (nextIndex >= currentSession.steps.length) {
      // Completed last step, set to complete state
      set({
        currentSession: {
          ...currentSession,
          status: "completed"
        }
      });
      return;
    }

    set({
      currentSession: {
        ...currentSession,
        currentStepIndex: nextIndex,
        timeRemainingSeconds: currentSession.steps[nextIndex].durationSeconds
      }
    });
  },

  prevStep: () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.currentStepIndex <= 0) return;
    const prevIndex = currentSession.currentStepIndex - 1;
    set({
      currentSession: {
        ...currentSession,
        currentStepIndex: prevIndex,
        timeRemainingSeconds: currentSession.steps[prevIndex].durationSeconds
      }
    });
  },

  submitResponse: async (stepIndex, response) => {
    const { currentSession } = get();
    if (!currentSession) return;
    const newResponses = { ...currentSession.responses, [stepIndex]: response };
    set({
      currentSession: {
        ...currentSession,
        responses: newResponses
      }
    });

    if (response && !response.questionnaire) {
      try {
        const { submitStepAttempt } = await import("@/services/api/assessments.service");
        const currentStep = currentSession.steps[stepIndex];
        const { getTaskIdFromStep } = await import("@/lib/taskRegistry");
        const taskId = getTaskIdFromStep(currentStep);

        // All React task components now emit camelCase keys directly.
        const accuracy        = response.accuracy        ?? 100;
        const reactionTime    = response.reactionTime    ?? 0;
        const correctResponses  = response.correctResponses  ?? 0;
        const missedResponses   = response.missedResponses   ?? 0;
        const commissionErrors  = response.commissionErrors  ?? 0;
        const completionTime    = response.completionTime    ?? 0;

        await submitStepAttempt(currentSession.id, stepIndex, {
          taskId,
          domain: currentStep.domain,
          isPractice: false,
          accuracy,
          reactionTime,
          correctResponses,
          missedResponses,
          commissionErrors,
          completionTime,
          rawMetrics: response
        });
      } catch (err) {
        console.error("Failed to submit live task attempt:", err);
      }
    }
  },

  tickTimer: () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.status !== "started") return;
    
    if (currentSession.timeRemainingSeconds <= 1) {
      // Step duration is up! Move to next step automatically
      get().nextStep();
    } else {
      set({
        currentSession: {
          ...currentSession,
          timeRemainingSeconds: currentSession.timeRemainingSeconds - 1
        }
      });
    }
  },

  submitSession: async () => {
    const { currentSession } = get();
    if (!currentSession) throw new Error("No active session");
    
    set({ isLoading: true });
    try {
      const result = await submitAssessmentResponses(currentSession.id, currentSession.responses);
      set({
        currentSession: {
          ...currentSession,
          status: "completed"
        },
        isLoading: false
      });
      return result.generatedReportId || "";
    } catch (err: any) {
      set({ error: err.message || "Failed to submit responses", isLoading: false });
      throw err;
    }
  }
}));
