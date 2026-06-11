export type SubjectId = "ios" | "wf2";

export type ChapterId =
  | "CH01"
  | "CH02"
  | "CH03"
  | "CH04"
  | "CH05"
  | "CH06"
  | "CH07"
  | "CH09"
  | "CH10"
  | "CH11"
  | "CH12"
  | "CH13"
  | "CH14"
  | "WF2_OVERVIEW"
  | "WF2_AUTO_CONFIG"
  | "WF2_STARTERS"
  | "WF2_EMBEDDED_SERVER"
  | "WF2_ACTUATOR"
  | "WF2_BEAN_CONFIG"
  | "WF2_PROJECT_STRUCTURE"
  | "WF2_POM_RUNTIME";

export type QuestionKind = "choice" | "truth" | "short" | "essay";
export type Priority = 1 | 2 | 3;

export interface Chapter {
  id: ChapterId;
  subject: SubjectId;
  title: string;
  weight: "기반" | "중요" | "매우 중요";
  focus: string;
}

export interface BaseQuestion {
  id: string;
  chapter: ChapterId;
  kind: QuestionKind;
  priority: Priority;
  prompt: string;
  explanation: string;
  tags: string[];
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: "choice";
  options: string[];
  answerIndex: number;
}

export interface TruthQuestion extends BaseQuestion {
  kind: "truth";
  answer: boolean;
}

export interface ShortQuestion extends BaseQuestion {
  kind: "short";
  answer: string;
  keywords: string[];
}

export interface EssayQuestion extends BaseQuestion {
  kind: "essay";
  answer: string[];
}

export type Question = ChoiceQuestion | TruthQuestion | ShortQuestion | EssayQuestion;

export interface StoredQuestionState {
  attempts: number;
  correct: number;
  lastResult?: "correct" | "wrong" | "self";
  bookmarked?: boolean;
  lastAnsweredAt?: string;
}

export type ProgressMap = Record<string, StoredQuestionState>;
