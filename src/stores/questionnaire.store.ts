import { create } from "zustand";
import { QuestionnaireResponse, QuestionnaireSlug } from "@/types/questionnaire.types";

interface QuestionnaireState {
  responses: Record<QuestionnaireSlug, QuestionnaireResponse>;
  completed: Record<QuestionnaireSlug, boolean>;
  submitAnswer: (slug: QuestionnaireSlug, questionId: string, value: number) => void;
  submitQuestionnaire: (slug: QuestionnaireSlug) => void;
  resetQuestionnaire: (slug: QuestionnaireSlug) => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>((set) => ({
  responses: {
    "phq-9": {},
    "gad-7": {},
    "pss-10": {},
  },
  completed: {
    "phq-9": false,
    "gad-7": false,
    "pss-10": false,
  },

  submitAnswer: (slug, questionId, value) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [slug]: {
          ...state.responses[slug],
          [questionId]: value,
        },
      },
    }));
  },

  submitQuestionnaire: (slug) => {
    set((state) => ({
      completed: {
        ...state.completed,
        [slug]: true,
      },
    }));
  },

  resetQuestionnaire: (slug) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [slug]: {},
      },
      completed: {
        ...state.completed,
        [slug]: false,
      },
    }));
  },
}));
