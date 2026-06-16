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

  submitResponse: (stepIndex, response) => {
    const { currentSession } = get();
    if (!currentSession) return;
    const newResponses = { ...currentSession.responses, [stepIndex]: response };
    set({
      currentSession: {
        ...currentSession,
        responses: newResponses
      }
    });
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
