import { useQuestionnaireStore } from "@/stores/questionnaire.store";
import { QuestionnaireSlug } from "@/types/questionnaire.types";

export function useQuestionnaire(slug: QuestionnaireSlug) {
  const responses = useQuestionnaireStore((state) => state.responses[slug]);
  const isCompleted = useQuestionnaireStore((state) => state.completed[slug]);
  const submitAnswer = useQuestionnaireStore((state) => state.submitAnswer);
  const submitQuestionnaire = useQuestionnaireStore((state) => state.submitQuestionnaire);
  const resetQuestionnaire = useQuestionnaireStore((state) => state.resetQuestionnaire);

  const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);

  return {
    responses,
    isCompleted,
    totalScore,
    submitAnswer: (questionId: string, value: number) => submitAnswer(slug, questionId, value),
    submitQuestionnaire: () => submitQuestionnaire(slug),
    resetQuestionnaire: () => resetQuestionnaire(slug),
  };
}
