import type { ProgressMap, StoredQuestionState } from "../types";

const storageKey = "ios-exam-trainer-progress-v1";

export function loadProgress(): ProgressMap {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap): void {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function emptyQuestionState(): StoredQuestionState {
  return { attempts: 0, correct: 0 };
}

export function recordAnswer(
  progress: ProgressMap,
  questionId: string,
  result: "correct" | "wrong" | "self",
): ProgressMap {
  const before = progress[questionId] ?? emptyQuestionState();
  return {
    ...progress,
    [questionId]: {
      ...before,
      attempts: before.attempts + 1,
      correct: before.correct + (result === "correct" ? 1 : 0),
      lastResult: result,
      lastAnsweredAt: new Date().toISOString(),
    },
  };
}

export function toggleBookmark(progress: ProgressMap, questionId: string): ProgressMap {
  const before = progress[questionId] ?? emptyQuestionState();
  return {
    ...progress,
    [questionId]: {
      ...before,
      bookmarked: !before.bookmarked,
    },
  };
}
