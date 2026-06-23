export type QuestionnaireSlug = "phq-9" | "gad-7" | "araq" | "mixed";

export interface QuestionnaireItem {
  id: string;
  text: string;
  options: {
    label: string;
    value: number;
  }[];
}

export interface Questionnaire {
  title: string;
  description: string;
  slug: QuestionnaireSlug;
  items: QuestionnaireItem[];
}

export type QuestionnaireResponse = Record<string, number>; // questionId -> value
