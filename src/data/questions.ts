import type { Question } from "../types";
import { iosQuestions } from "./iosQuestions";
import { webFramework2Questions } from "./webFramework2Questions";

export { iosQuestions, webFramework2Questions };

export const questions: Question[] = [...iosQuestions, ...webFramework2Questions];
