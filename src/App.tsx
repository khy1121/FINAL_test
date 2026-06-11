import { useEffect, useMemo, useState, type ReactNode } from "react";
import { chapters, subjectLabels, topMemorizeBySubject } from "./data/chapters";
import { extractNoteSections, notesBySubject } from "./data/notes";
import { questions } from "./data/questions";
import { webFramework2ExamTables } from "./data/webFramework2Tables";
import type { ChapterId, Priority, ProgressMap, Question, QuestionKind, SubjectId } from "./types";
import { loadProgress, recordAnswer, saveProgress, toggleBookmark } from "./utils/progress";

type Screen = "home" | "quiz" | "result" | "review" | "notes";
type StudyMode = "ios-all" | "wf2-all" | "ios-quick" | "wf2-quick";
type FilterValue<T extends string | number> = T | "all";
type AnswerResult = "correct" | "wrong" | "self";
type QuizSource = "normal" | "review";

interface ModeConfig {
  id: StudyMode;
  subject: SubjectId;
  title: string;
  subtitle: string;
  label: string;
  quick: boolean;
}

const modeConfigs: ModeConfig[] = [
  {
    id: "ios-all",
    subject: "ios",
    title: "iOS 전체 풀기",
    subtitle: "PPT와 MD 기반 전체 문제은행",
    label: "전체",
    quick: false,
  },
  {
    id: "wf2-all",
    subject: "wf2",
    title: "웹프레임워크2 전체 풀기",
    subtitle: "Spring Boot 수업 자료 전체",
    label: "전체",
    quick: false,
  },
  {
    id: "ios-quick",
    subject: "ios",
    title: "iOS 빠른풀기",
    subtitle: "20~25문항 랜덤 시험지",
    label: "시험",
    quick: true,
  },
  {
    id: "wf2-quick",
    subject: "wf2",
    title: "웹프레임워크2 빠른풀기",
    subtitle: "20~25문항 랜덤 시험지",
    label: "시험",
    quick: true,
  },
];

const kindLabels: Record<QuestionKind, string> = {
  choice: "객관식",
  truth: "OX",
  short: "단답형",
  essay: "서술형",
};

const priorityLabels: Record<Priority, string> = {
  1: "기본",
  2: "중요",
  3: "최중요",
};

const visibleKinds: QuestionKind[] = ["choice", "short"];
const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]));

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getQuestionSubject(question: Question): SubjectId {
  return chapterById.get(question.chapter)?.subject ?? "ios";
}

function matchesQuery(question: Question, query: string) {
  if (!query.trim()) {
    return true;
  }

  const text = [
    question.prompt,
    question.explanation,
    question.tags.join(" "),
    "options" in question ? question.options.join(" ") : "",
    "answer" in question ? (Array.isArray(question.answer) ? question.answer.join(" ") : String(question.answer)) : "",
  ].join(" ");

  return normalize(text).includes(normalize(query));
}

function isShortCorrect(question: Extract<Question, { kind: "short" }>, value: string) {
  const answer = normalize(value);
  return Boolean(answer) && question.keywords.every((keyword) => answer.includes(normalize(keyword)));
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
}

function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  return [progress, setProgress] as const;
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeMode, setActiveMode] = useState<StudyMode>("ios-quick");
  const [quizSource, setQuizSource] = useState<QuizSource>("normal");
  const [chapter, setChapter] = useState<FilterValue<ChapterId>>("all");
  const [kind, setKind] = useState<FilterValue<QuestionKind>>("all");
  const [priority, setPriority] = useState<FilterValue<Priority>>("all");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [truth, setTruth] = useState<boolean | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [quickSeed, setQuickSeed] = useState(() => Date.now());
  const [sessionResults, setSessionResults] = useState<Record<string, AnswerResult>>({});
  const [progress, setProgress] = useProgress();

  const mode = modeConfigs.find((item) => item.id === activeMode) ?? modeConfigs[0];
  const activeSubject = mode.subject;

  const subjectChapters = useMemo(
    () => chapters.filter((item) => item.subject === activeSubject),
    [activeSubject],
  );

  const subjectQuestions = useMemo(
    () => questions.filter((question) => getQuestionSubject(question) === activeSubject),
    [activeSubject],
  );

  const modeQuestions = useMemo(() => {
    if (!mode.quick) {
      return subjectQuestions;
    }
    const quickCount = 20 + (quickSeed % 6);
    return seededShuffle(subjectQuestions, quickSeed).slice(0, quickCount);
  }, [mode.quick, quickSeed, subjectQuestions]);

  const reviewQuestions = useMemo(
    () => subjectQuestions.filter((question) => {
      const state = progress[question.id];
      return state?.lastResult === "wrong" || state?.bookmarked;
    }),
    [progress, subjectQuestions],
  );

  const quizBaseQuestions = quizSource === "review" ? reviewQuestions : modeQuestions;

  const filteredQuestions = useMemo(() => {
    return quizBaseQuestions.filter((question) => (
      (chapter === "all" || question.chapter === chapter) &&
      (kind === "all" || question.kind === kind) &&
      (priority === "all" || question.priority === priority) &&
      matchesQuery(question, query)
    ));
  }, [chapter, kind, priority, query, quizBaseQuestions]);

  const current = filteredQuestions[index] ?? null;

  const subjectStats = useMemo(() => {
    const makeStats = (subject: SubjectId) => {
      const scoped = questions.filter((question) => getQuestionSubject(question) === subject);
      const attempts = scoped.reduce((sum, question) => sum + (progress[question.id]?.attempts ?? 0), 0);
      const correct = scoped.reduce((sum, question) => sum + (progress[question.id]?.correct ?? 0), 0);
      const answered = scoped.filter((question) => progress[question.id]?.attempts).length;
      const wrong = scoped.filter((question) => progress[question.id]?.lastResult === "wrong").length;
      const bookmarked = scoped.filter((question) => progress[question.id]?.bookmarked).length;
      return {
        total: scoped.length,
        attempts,
        correct,
        answered,
        wrong,
        bookmarked,
        accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      };
    };

    return {
      ios: makeStats("ios"),
      wf2: makeStats("wf2"),
    };
  }, [progress]);

  const modeStats = useMemo(() => {
    const scopedIds = new Set(quizBaseQuestions.map((question) => question.id));
    const scopedStates = Object.entries(progress).filter(([id]) => scopedIds.has(id)).map(([, state]) => state);
    const attempts = scopedStates.reduce((sum, item) => sum + item.attempts, 0);
    const correct = scopedStates.reduce((sum, item) => sum + item.correct, 0);
    const answered = quizBaseQuestions.filter((question) => progress[question.id]?.attempts > 0).length;
    const wrong = quizBaseQuestions.filter((question) => progress[question.id]?.lastResult === "wrong").length;
    const bookmarked = quizBaseQuestions.filter((question) => progress[question.id]?.bookmarked).length;

    return {
      attempts,
      correct,
      answered,
      wrong,
      bookmarked,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
    };
  }, [progress, quizBaseQuestions]);

  const chapterStats = useMemo(() => {
    return subjectChapters.map((item) => {
      const list = subjectQuestions.filter((question) => question.chapter === item.id);
      const done = list.filter((question) => progress[question.id]?.attempts > 0).length;
      return { ...item, total: list.length, done };
    });
  }, [progress, subjectChapters, subjectQuestions]);

  const noteSections = useMemo(
    () => extractNoteSections(notesBySubject[activeSubject]),
    [activeSubject],
  );

  const noteResults = useMemo(() => {
    const q = normalize(query);
    return noteSections
      .filter((section) => {
        if (!q) {
          return true;
        }
        return normalize(`${section.title} ${section.body}`).includes(q);
      })
      .slice(0, q ? 18 : 10);
  }, [noteSections, query]);

  const sessionSummary = useMemo(() => {
    const results = Object.values(sessionResults);
    const correct = results.filter((result) => result === "correct").length;
    const wrong = results.filter((result) => result === "wrong").length;
    const self = results.filter((result) => result === "self").length;
    const total = filteredQuestions.length;
    return {
      correct,
      wrong,
      self,
      answered: results.length,
      total,
      score: total ? Math.round((correct / total) * 100) : 0,
    };
  }, [filteredQuestions.length, sessionResults]);

  useEffect(() => {
    setIndex(0);
  }, [chapter, kind, priority, query, quickSeed, quizSource]);

  useEffect(() => {
    resetAnswer();
  }, [current?.id]);

  function resetAnswer() {
    setChoice(null);
    setTruth(null);
    setTextAnswer("");
    setRevealed(false);
  }

  function resetFilters() {
    setChapter("all");
    setKind("all");
    setPriority("all");
    setQuery("");
  }

  function startMode(nextMode: StudyMode) {
    setActiveMode(nextMode);
    setQuizSource("normal");
    if (modeConfigs.find((item) => item.id === nextMode)?.quick) {
      setQuickSeed(Date.now());
    }
    resetFilters();
    setIndex(0);
    setSessionResults({});
    resetAnswer();
    setScreen("quiz");
  }

  function startReviewSession() {
    setQuizSource("review");
    resetFilters();
    setIndex(0);
    setSessionResults({});
    resetAnswer();
    setScreen("quiz");
  }

  function goHome() {
    setScreen("home");
    setQuizSource("normal");
    resetAnswer();
  }

  function regenerateQuickSet() {
    setQuickSeed(Date.now());
    setSessionResults({});
    setIndex(0);
    resetAnswer();
  }

  function record(result: AnswerResult) {
    if (!current) {
      return;
    }
    setProgress((before) => recordAnswer(before, current.id, result));
    setSessionResults((before) => ({ ...before, [current.id]: result }));
    setRevealed(true);
  }

  function submit() {
    if (!current) {
      return;
    }

    if (current.kind === "choice" && choice !== null) {
      record(choice === current.answerIndex ? "correct" : "wrong");
    }

    if (current.kind === "truth" && truth !== null) {
      record(truth === current.answer ? "correct" : "wrong");
    }

    if (current.kind === "short") {
      record(isShortCorrect(current, textAnswer) ? "correct" : "wrong");
    }
  }

  function moveNext() {
    if (index >= filteredQuestions.length - 1) {
      setScreen("result");
      return;
    }
    setIndex((value) => value + 1);
  }

  function resetProgress() {
    if (window.confirm("현재 저장된 풀이 기록과 북마크를 모두 삭제할까요?")) {
      setProgress({});
      setSessionResults({});
    }
  }

  if (screen === "quiz") {
    return (
      <QuizScreen
        activeSubject={activeSubject}
        chapter={chapter}
        chapterStats={chapterStats}
        current={current}
        filteredQuestions={filteredQuestions}
        index={index}
        kind={kind}
        mode={mode}
        modeStats={modeStats}
        onBookmark={() => current && setProgress((before) => toggleBookmark(before, current.id))}
        onChapterChange={setChapter}
        onChoice={setChoice}
        onFinish={() => setScreen("result")}
        onGoHome={goHome}
        onKindChange={setKind}
        onMoveNext={moveNext}
        onMovePrevious={() => setIndex((value) => Math.max(value - 1, 0))}
        onPriorityChange={setPriority}
        onQueryChange={setQuery}
        onRegenerate={regenerateQuickSet}
        onReview={() => setScreen("review")}
        onSetTextAnswer={setTextAnswer}
        onSetTruth={setTruth}
        onSubmit={submit}
        onEssayCorrect={() => record("correct")}
        onEssayReveal={() => {
          if (current) {
            setSessionResults((before) => ({ ...before, [current.id]: "self" }));
          }
          setRevealed(true);
        }}
        onEssayWrong={() => record("wrong")}
        priority={priority}
        progress={progress}
        query={query}
        quizSource={quizSource}
        revealed={revealed}
        selectedChoice={choice}
        sessionSummary={sessionSummary}
        subjectChapters={subjectChapters}
        textAnswer={textAnswer}
        truth={truth}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        mode={mode}
        onGoHome={goHome}
        onNewQuick={regenerateQuickSet}
        onReview={() => setScreen("review")}
        onRetry={() => {
          setIndex(0);
          setSessionResults({});
          resetAnswer();
          setScreen("quiz");
        }}
        summary={sessionSummary}
      />
    );
  }

  if (screen === "review") {
    return (
      <ReviewScreen
        activeSubject={activeSubject}
        mode={mode}
        onGoHome={goHome}
        onStartReview={startReviewSession}
        onToggleBookmark={(questionId) => setProgress((before) => toggleBookmark(before, questionId))}
        progress={progress}
        questions={reviewQuestions}
      />
    );
  }

  if (screen === "notes") {
    return (
      <NotesScreen
        activeSubject={activeSubject}
        onGoHome={goHome}
        onQueryChange={setQuery}
        query={query}
        sections={noteResults}
      />
    );
  }

  return (
    <HomeScreen
      activeMode={activeMode}
      modeConfigs={modeConfigs}
      onNotes={() => setScreen("notes")}
      onResetProgress={resetProgress}
      onReview={() => setScreen("review")}
      onSelectMode={setActiveMode}
      onStartMode={startMode}
      subjectStats={subjectStats}
    />
  );
}

interface HomeScreenProps {
  activeMode: StudyMode;
  modeConfigs: ModeConfig[];
  subjectStats: Record<SubjectId, { total: number; answered: number; accuracy: number; wrong: number; bookmarked: number }>;
  onSelectMode: (mode: StudyMode) => void;
  onStartMode: (mode: StudyMode) => void;
  onReview: () => void;
  onNotes: () => void;
  onResetProgress: () => void;
}

function HomeScreen({
  activeMode,
  modeConfigs: configs,
  subjectStats,
  onNotes,
  onResetProgress,
  onReview,
  onSelectMode,
  onStartMode,
}: HomeScreenProps) {
  const selected = configs.find((mode) => mode.id === activeMode) ?? configs[0];

  return (
    <main className="min-h-screen bg-[#f7fbf2] pb-24 text-[#243042] lg:pb-0">
      <header className="border-b-4 border-[#46a302] bg-[#58cc02] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-white/80">Exam Trainer</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-5xl">
                오늘 풀 시험지를 고르세요
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/90 sm:text-base sm:leading-7">
                홈, 퀴즈, 결과, 복습, 노트가 분리된 학습 흐름으로 iOS와 웹프레임워크2를 반복 연습합니다.
              </p>
            </div>
            <div className="duo-card bg-white p-4 text-[#243042] sm:p-5">
              <p className="text-sm font-black text-slate-500">선택한 코스</p>
              <h2 className="mt-2 text-xl font-black sm:text-2xl">{selected.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{selected.subtitle}</p>
              <button className="duo-primary duo-press mt-5 w-full px-5 py-3 text-sm" onClick={() => onStartMode(selected.id)} type="button">
                시작하기
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 lg:px-8">
        <section className="space-y-6">
          <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {configs.map((mode) => (
              <button
                key={mode.id}
                className={cx("duo-card duo-press p-4 text-left sm:p-5", activeMode === mode.id && "duo-card-active")}
                onClick={() => {
                  onSelectMode(mode.id);
                  onStartMode(mode.id);
                }}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={mode.quick ? "amber" : "teal"}>{mode.label}</Badge>
                  <span className="text-sm font-black text-slate-500">{mode.quick ? "20~25문항" : "전체 문제"}</span>
                </div>
                <h2 className="mt-4 text-lg font-black leading-6 text-[#243042] sm:text-2xl">{mode.title}</h2>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">{mode.subtitle}</p>
              </button>
            ))}
          </section>

          <section className="duo-card p-5">
            <h2 className="text-lg font-black text-[#243042]">과목 진행 상황</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(["ios", "wf2"] satisfies SubjectId[]).map((subject) => {
                const stats = subjectStats[subject];
                const ratio = Math.round((stats.answered / Math.max(stats.total, 1)) * 100);
                return (
                  <article key={subject} className="rounded-lg border-2 border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black">{subjectLabels[subject]}</h3>
                      <span className="text-sm font-black text-[#58cc02]">{ratio}%</span>
                    </div>
                    <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#e8eef5]">
                      <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${ratio}%` }} />
                    </div>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <MiniStat label="풀이" value={`${stats.answered}/${stats.total}`} />
                      <MiniStat label="정확도" value={`${stats.accuracy}%`} />
                      <MiniStat label="오답" value={String(stats.wrong)} />
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section className="duo-card p-5">
            <h2 className="text-lg font-black">빠른 이동</h2>
            <div className="mt-4 grid gap-3">
              <button className="duo-secondary duo-press px-4 py-3 text-sm" onClick={onReview} type="button">
                오답과 북마크
              </button>
              <button className="duo-secondary duo-press px-4 py-3 text-sm" onClick={onNotes} type="button">
                노트와 시험표
              </button>
              <button className="duo-secondary duo-press px-4 py-3 text-sm" onClick={onResetProgress} type="button">
                기록 초기화
              </button>
            </div>
          </section>
          <section className="duo-card p-5">
            <h2 className="text-lg font-black">학습 규칙</h2>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-600">
              <li>빠른풀기는 매번 20~25문항을 새로 섞습니다.</li>
              <li>서술형 대비 문항은 객관식으로 변환되어 출제됩니다.</li>
              <li>틀린 문제와 북마크는 복습 화면에 모입니다.</li>
            </ul>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#d9e4ef] bg-white/95 p-3 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <button className="duo-primary duo-press w-full px-5 py-3 text-sm" onClick={() => onStartMode(selected.id)} type="button">
          선택한 퀴즈 바로 풀기
        </button>
      </div>
    </main>
  );
}

interface QuizScreenProps {
  activeSubject: SubjectId;
  mode: ModeConfig;
  quizSource: QuizSource;
  subjectChapters: typeof chapters;
  chapterStats: Array<(typeof chapters)[number] & { total: number; done: number }>;
  filteredQuestions: Question[];
  current: Question | null;
  index: number;
  progress: ProgressMap;
  modeStats: { attempts: number; correct: number; answered: number; wrong: number; bookmarked: number; accuracy: number };
  sessionSummary: { correct: number; wrong: number; self: number; answered: number; total: number; score: number };
  chapter: FilterValue<ChapterId>;
  kind: FilterValue<QuestionKind>;
  priority: FilterValue<Priority>;
  query: string;
  selectedChoice: number | null;
  truth: boolean | null;
  textAnswer: string;
  revealed: boolean;
  onGoHome: () => void;
  onReview: () => void;
  onFinish: () => void;
  onRegenerate: () => void;
  onChapterChange: (value: FilterValue<ChapterId>) => void;
  onKindChange: (value: FilterValue<QuestionKind>) => void;
  onPriorityChange: (value: FilterValue<Priority>) => void;
  onQueryChange: (value: string) => void;
  onChoice: (value: number) => void;
  onSetTruth: (value: boolean) => void;
  onSetTextAnswer: (value: string) => void;
  onSubmit: () => void;
  onBookmark: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
  onEssayReveal: () => void;
  onEssayCorrect: () => void;
  onEssayWrong: () => void;
}

function QuizScreen(props: QuizScreenProps) {
  const {
    activeSubject,
    chapter,
    chapterStats,
    current,
    filteredQuestions,
    index,
    kind,
    mode,
    modeStats,
    onChapterChange,
    onFinish,
    onGoHome,
    onKindChange,
    onPriorityChange,
    onQueryChange,
    onRegenerate,
    onReview,
    priority,
    query,
    quizSource,
    sessionSummary,
    subjectChapters,
  } = props;
  const progressPercent = Math.round(((index + 1) / Math.max(filteredQuestions.length, 1)) * 100);
  const activeChapterLabel = chapter === "all" ? "전체 챕터" : chapterById.get(chapter)?.title ?? String(chapter);

  return (
    <main className="min-h-screen bg-[#f7fbf2] pb-28 text-[#243042] sm:pb-0">
      <header className="border-b-4 border-[#46a302] bg-[#58cc02] text-white">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button className="duo-secondary duo-press bg-white px-3 py-2 text-sm text-[#243042] sm:px-4" onClick={onGoHome} type="button">
                홈
              </button>
              <div>
                <p className="text-xs font-black uppercase text-white/80">{subjectLabels[activeSubject]}</p>
                <h1 className="text-base font-black leading-6 text-white sm:text-xl">{quizSource === "review" ? "복습 세션" : mode.title}</h1>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
              <Stat label="진행" value={`${index + 1}/${filteredQuestions.length || 0}`} />
              <Stat label="세션 정답" value={String(sessionSummary.correct)} />
              <Stat label="세션 오답" value={String(sessionSummary.wrong)} tone="rose" />
              <Stat label="누적 정확도" value={`${modeStats.accuracy}%`} />
              <Stat label="북마크" value={String(modeStats.bookmarked)} tone="amber" />
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/30 sm:mt-4 sm:h-4">
            <div className="h-full rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:px-6 sm:py-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6 lg:px-8">
        <section className="lg:hidden">
          <details className="duo-card p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black">
              <span>필터 / 챕터</span>
              <span className="min-w-0 truncate rounded-md border-2 border-slate-100 bg-[#f7fbf2] px-2.5 py-1 text-xs text-slate-600">
                {activeChapterLabel}
              </span>
            </summary>
            <div className="mt-4 grid gap-3">
              <Select label="챕터" value={chapter} onChange={(value) => onChapterChange(value as FilterValue<ChapterId>)}>
                <option value="all">전체 챕터</option>
                {subjectChapters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
              <Select label="유형" value={kind} onChange={(value) => onKindChange(value as FilterValue<QuestionKind>)}>
                <option value="all">전체 유형</option>
                {visibleKinds.map((value) => (
                  <option key={value} value={value}>
                    {kindLabels[value]}
                  </option>
                ))}
              </Select>
              <Select
                label="중요도"
                value={String(priority)}
                onChange={(value) => onPriorityChange(value === "all" ? "all" : (Number(value) as Priority))}
              >
                <option value="all">전체 중요도</option>
                <option value="3">최중요</option>
                <option value="2">중요</option>
                <option value="1">기본</option>
              </Select>
              <input
                className="duo-input px-3 py-3 text-base font-bold sm:text-sm"
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="검색"
                value={query}
              />
            </div>
          </details>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {mode.quick && quizSource === "normal" && (
              <button className="duo-secondary duo-press shrink-0 px-3 py-2.5 text-sm" onClick={onRegenerate} type="button">
                새 시험지
              </button>
            )}
            <button className="duo-secondary duo-press shrink-0 px-3 py-2.5 text-sm" onClick={onReview} type="button">
              복습 목록
            </button>
            <button className="duo-secondary duo-press shrink-0 px-3 py-2.5 text-sm" onClick={onFinish} type="button">
              결과 보기
            </button>
          </div>
        </section>

        <aside className="hidden space-y-4 lg:sticky lg:top-5 lg:block lg:self-start">
          <section className="duo-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-black">필터</h2>
              <Badge tone={mode.quick ? "amber" : "teal"}>{quizSource === "review" ? "복습" : mode.quick ? "시험" : "전체"}</Badge>
            </div>
            <div className="mt-4 grid gap-3">
              <Select label="챕터" value={chapter} onChange={(value) => onChapterChange(value as FilterValue<ChapterId>)}>
                <option value="all">전체 챕터</option>
                {subjectChapters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
              <Select label="유형" value={kind} onChange={(value) => onKindChange(value as FilterValue<QuestionKind>)}>
                <option value="all">전체 유형</option>
                {visibleKinds.map((value) => (
                  <option key={value} value={value}>
                    {kindLabels[value]}
                  </option>
                ))}
              </Select>
              <Select
                label="중요도"
                value={String(priority)}
                onChange={(value) => onPriorityChange(value === "all" ? "all" : (Number(value) as Priority))}
              >
                <option value="all">전체 중요도</option>
                <option value="3">최중요</option>
                <option value="2">중요</option>
                <option value="1">기본</option>
              </Select>
              <input
                className="duo-input px-3 py-2.5 text-sm font-bold"
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="검색"
                value={query}
              />
            </div>
          </section>

          <section className="duo-card p-4">
            <h2 className="text-sm font-black">학습 경로</h2>
            <div className="mt-4 space-y-4">
              {chapterStats.map((item) => {
                const ratio = item.total ? Math.round((item.done / item.total) * 100) : 0;
                return (
                  <button
                    key={item.id}
                    className={cx(
                      "duo-press flex w-full gap-3 rounded-lg border-2 p-3 text-left",
                      chapter === item.id ? "border-[#58cc02] bg-[#f1ffe8]" : "border-slate-200 bg-white hover:border-[#58cc02]",
                    )}
                    onClick={() => onChapterChange(item.id)}
                    type="button"
                  >
                    <span className={cx("duo-node shrink-0", ratio === 0 && "border-slate-300 bg-slate-100 text-slate-500 shadow-[0_4px_0_#d7e2ec]")}>
                      {ratio === 100 ? "✓" : item.done || "•"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-black">{item.title}</span>
                        <span className="shrink-0 text-xs font-bold text-slate-500">
                          {item.done}/{item.total}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.focus}</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${ratio}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-4 sm:space-y-5">
          <div className="duo-card hidden flex-col gap-4 p-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">{quizSource === "review" ? "오답과 북마크만 풀기" : mode.subtitle}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                현재 조건 {filteredQuestions.length}문제 · {progressPercent}% 진행
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mode.quick && quizSource === "normal" && (
                <button className="duo-secondary duo-press px-3 py-2 text-sm" onClick={onRegenerate} type="button">
                  새 시험지
                </button>
              )}
              <button className="duo-secondary duo-press px-3 py-2 text-sm" onClick={onReview} type="button">
                복습 목록
              </button>
              <button className="duo-secondary duo-press px-3 py-2 text-sm" onClick={onFinish} type="button">
                결과 보기
              </button>
            </div>
          </div>

          {current ? (
            <QuestionView
              choice={props.selectedChoice}
              current={current}
              index={index}
              onBookmark={props.onBookmark}
              onChoice={props.onChoice}
              onEssayCorrect={props.onEssayCorrect}
              onEssayReveal={props.onEssayReveal}
              onEssayWrong={props.onEssayWrong}
              onMoveNext={props.onMoveNext}
              onMovePrevious={props.onMovePrevious}
              onSubmit={props.onSubmit}
              progress={props.progress}
              revealed={props.revealed}
              setTextAnswer={props.onSetTextAnswer}
              setTruth={props.onSetTruth}
              textAnswer={props.textAnswer}
              total={filteredQuestions.length}
              truth={props.truth}
            />
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </main>
  );
}

interface QuestionViewProps {
  current: Question;
  progress: ProgressMap;
  index: number;
  total: number;
  choice: number | null;
  truth: boolean | null;
  textAnswer: string;
  revealed: boolean;
  onChoice: (value: number) => void;
  setTruth: (value: boolean) => void;
  setTextAnswer: (value: string) => void;
  onSubmit: () => void;
  onBookmark: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
  onEssayReveal: () => void;
  onEssayCorrect: () => void;
  onEssayWrong: () => void;
}

function QuestionView(props: QuestionViewProps) {
  const { current, progress, index, total, choice, truth, textAnswer, revealed } = props;
  const state = progress[current.id];
  const result = state?.lastResult;
  const canSubmit =
    !revealed &&
    ((current.kind === "choice" && choice !== null) ||
      (current.kind === "truth" && truth !== null) ||
      (current.kind === "short" && textAnswer.trim().length > 0));

  return (
    <article className="duo-card mobile-quiz-card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{chapterById.get(current.chapter)?.title ?? current.chapter}</Badge>
            <Badge>{kindLabels[current.kind]}</Badge>
            <Badge tone={current.priority === 3 ? "rose" : current.priority === 2 ? "amber" : "slate"}>
              {priorityLabels[current.priority]}
            </Badge>
            {state?.bookmarked && <Badge tone="amber">북마크</Badge>}
            {result === "wrong" && <Badge tone="rose">오답</Badge>}
          </div>
          <h2 className="max-w-4xl text-xl font-black leading-8 sm:text-2xl sm:leading-9">{current.prompt}</h2>
        </div>
        <button className="duo-secondary duo-press w-full px-3 py-2.5 text-sm sm:w-auto sm:py-2" onClick={props.onBookmark} type="button">
          {state?.bookmarked ? "북마크 해제" : "북마크"}
        </button>
      </div>

      <div className="mt-5 sm:mt-6">
        {current.kind === "choice" && (
          <div className="grid gap-3">
            {current.options.map((option, optionIndex) => {
              const selected = choice === optionIndex;
              const correct = revealed && optionIndex === current.answerIndex;
              const wrong = revealed && selected && optionIndex !== current.answerIndex;
              return (
                <button
                  key={option}
                  className={cx(
                    "duo-option duo-press flex min-h-[64px] w-full items-start p-3 text-left text-sm font-bold leading-6 sm:p-4 sm:text-base sm:leading-7",
                    selected && "duo-option-selected",
                    correct && "duo-option-correct",
                    wrong && "duo-option-wrong",
                  )}
                  disabled={revealed}
                  onClick={() => props.onChoice(optionIndex)}
                  type="button"
                >
                  <span className="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#eef4fb] text-sm font-black text-slate-600">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {current.kind === "truth" && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                className={cx(
                  "duo-option duo-press min-h-[72px] p-5 text-lg font-black",
                  truth === value && "duo-option-selected",
                  revealed && value === current.answer && "duo-option-correct",
                  revealed && truth === value && value !== current.answer && "duo-option-wrong",
                )}
                disabled={revealed}
                onClick={() => props.setTruth(value)}
                type="button"
              >
                {value ? "O" : "X"}
              </button>
            ))}
          </div>
        )}

        {current.kind === "short" && (
          <input
            className="duo-input w-full px-4 py-4 text-base font-bold leading-7 placeholder:text-slate-400"
            disabled={revealed}
            onChange={(event) => props.setTextAnswer(event.target.value)}
            placeholder="답안을 입력하세요"
            value={textAnswer}
          />
        )}

        {current.kind === "essay" && (
          <div>
            <textarea
              className="duo-input min-h-40 w-full resize-y px-4 py-4 text-base font-bold leading-7 placeholder:text-slate-400"
              onChange={(event) => props.setTextAnswer(event.target.value)}
              placeholder="답안을 작성하세요"
              value={textAnswer}
            />
            <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
              <button className="duo-secondary duo-press px-4 py-3 text-sm sm:py-2" onClick={props.onEssayReveal} type="button">
                모범 답안 보기
              </button>
              <button className="duo-primary duo-press px-4 py-3 text-sm sm:py-2" onClick={props.onEssayCorrect} type="button">
                맞음으로 기록
              </button>
              <button className="duo-secondary duo-press px-4 py-3 text-sm sm:py-2" onClick={props.onEssayWrong} type="button">
                다시 볼 문제
              </button>
            </div>
          </div>
        )}
      </div>

      {revealed && <Answer current={current} result={result} />}

      <div className="mobile-answer-bar fixed inset-x-0 bottom-0 z-30 mt-0 flex flex-col gap-3 border-t-2 border-slate-100 bg-white p-3 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] sm:static sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:p-0 sm:pt-5 sm:shadow-none">
        <p className="text-center text-xs font-bold text-slate-500 sm:text-left sm:text-sm">
          {index + 1}/{total} · 시도 {state?.attempts ?? 0}회 · 정답 {state?.correct ?? 0}회
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {!revealed && current.kind !== "essay" && (
            <button className="duo-primary duo-press col-span-2 px-5 py-3 text-sm disabled:cursor-not-allowed sm:col-span-1 sm:py-2.5" disabled={!canSubmit} onClick={props.onSubmit} type="button">
              확인
            </button>
          )}
          <button className="duo-secondary duo-press px-4 py-3 text-sm disabled:opacity-50 sm:py-2" disabled={index === 0} onClick={props.onMovePrevious} type="button">
            이전
          </button>
          <button className="duo-primary duo-press px-5 py-3 text-sm sm:py-2" onClick={props.onMoveNext} type="button">
            {index >= total - 1 ? "결과 보기" : revealed ? "다음 문제" : "건너뛰기"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ResultScreen({
  mode,
  onGoHome,
  onNewQuick,
  onReview,
  onRetry,
  summary,
}: {
  mode: ModeConfig;
  summary: { correct: number; wrong: number; self: number; answered: number; total: number; score: number };
  onGoHome: () => void;
  onRetry: () => void;
  onReview: () => void;
  onNewQuick: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f7fbf2] px-4 py-10 text-[#243042]">
      <section className="duo-card mx-auto max-w-3xl p-6 text-center md:p-10">
        <p className="text-sm font-black uppercase text-[#58cc02]">Session Result</p>
        <h1 className="mt-2 text-4xl font-black">{mode.title} 완료</h1>
        <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#58cc02] bg-[#f1ffe8] text-4xl font-black text-[#46a302]">
          {summary.score}%
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <MiniStat label="푼 문제" value={`${summary.answered}/${summary.total}`} />
          <MiniStat label="정답" value={String(summary.correct)} />
          <MiniStat label="오답" value={String(summary.wrong)} />
          <MiniStat label="자가확인" value={String(summary.self)} />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button className="duo-primary duo-press px-5 py-3 text-sm" onClick={onRetry} type="button">
            같은 세션 다시 풀기
          </button>
          {mode.quick && (
            <button className="duo-secondary duo-press px-5 py-3 text-sm" onClick={onNewQuick} type="button">
              새 시험지 만들기
            </button>
          )}
          <button className="duo-secondary duo-press px-5 py-3 text-sm" onClick={onReview} type="button">
            오답 복습하기
          </button>
          <button className="duo-secondary duo-press px-5 py-3 text-sm" onClick={onGoHome} type="button">
            홈으로
          </button>
        </div>
      </section>
    </main>
  );
}

function ReviewScreen({
  activeSubject,
  mode,
  onGoHome,
  onStartReview,
  onToggleBookmark,
  progress,
  questions: reviewQuestions,
}: {
  activeSubject: SubjectId;
  mode: ModeConfig;
  questions: Question[];
  progress: ProgressMap;
  onGoHome: () => void;
  onStartReview: () => void;
  onToggleBookmark: (questionId: string) => void;
}) {
  return (
    <main className="min-h-screen bg-[#f7fbf2] text-[#243042]">
      <PageHeader title="오답과 북마크" subtitle={`${subjectLabels[activeSubject]} · ${mode.title}`} onGoHome={onGoHome}>
        <button className="duo-primary duo-press px-4 py-2 text-sm" disabled={!reviewQuestions.length} onClick={onStartReview} type="button">
          복습 세션 시작
        </button>
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {reviewQuestions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {reviewQuestions.map((question) => {
              const state = progress[question.id];
              return (
                <article key={question.id} className="duo-card p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{chapterById.get(question.chapter)?.title ?? question.chapter}</Badge>
                        <Badge>{kindLabels[question.kind]}</Badge>
                        {state?.lastResult === "wrong" && <Badge tone="rose">오답</Badge>}
                        {state?.bookmarked && <Badge tone="amber">북마크</Badge>}
                      </div>
                      <h2 className="mt-3 text-lg font-black leading-7">{question.prompt}</h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{question.explanation}</p>
                    </div>
                    <button className="duo-secondary duo-press shrink-0 px-4 py-2 text-sm" onClick={() => onToggleBookmark(question.id)} type="button">
                      {state?.bookmarked ? "북마크 해제" : "북마크"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function NotesScreen({
  activeSubject,
  onGoHome,
  onQueryChange,
  query,
  sections,
}: {
  activeSubject: SubjectId;
  query: string;
  sections: ReturnType<typeof extractNoteSections>;
  onGoHome: () => void;
  onQueryChange: (value: string) => void;
}) {
  return (
    <main className="min-h-screen bg-[#f7fbf2] text-[#243042]">
      <PageHeader title="노트와 시험표" subtitle={`${subjectLabels[activeSubject]} 원본 자료 검색`} onGoHome={onGoHome}>
        <input
          className="duo-input min-w-0 px-4 py-2.5 text-sm font-bold text-[#243042]"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="노트 검색"
          value={query}
        />
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Notes activeSubject={activeSubject} sections={sections} />
      </div>
    </main>
  );
}

function PageHeader({
  children,
  onGoHome,
  subtitle,
  title,
}: {
  title: string;
  subtitle: string;
  onGoHome: () => void;
  children?: ReactNode;
}) {
  return (
    <header className="border-b-4 border-[#46a302] bg-[#58cc02] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <button className="duo-secondary duo-press bg-white px-4 py-2 text-sm text-[#243042]" onClick={onGoHome} type="button">
            홈
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">{title}</h1>
            <p className="text-sm font-semibold text-white/85">{subtitle}</p>
          </div>
        </div>
        {children && <div className="flex flex-col gap-2 sm:flex-row">{children}</div>}
      </div>
    </header>
  );
}

function Answer({ current, result }: { current: Question; result?: AnswerResult }) {
  return (
    <div className={cx("mt-6 rounded-lg border-2 p-5", result === "wrong" ? "border-[#ff4b4b] bg-[#fff0f0]" : "border-[#58cc02] bg-[#f1ffe8]")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cx("rounded-md px-2.5 py-1 text-xs font-black text-white", result === "wrong" ? "bg-[#ff4b4b]" : "bg-[#58cc02]")}>
          {result === "wrong" ? "오답" : result === "self" ? "자가 채점" : "정답"}
        </span>
        <p className="text-sm font-bold leading-6">{current.explanation}</p>
      </div>
      {current.kind === "choice" && <p className="mt-3 text-sm font-bold leading-6">정답: {current.options[current.answerIndex]}</p>}
      {current.kind === "truth" && <p className="mt-3 text-sm font-bold">정답: {current.answer ? "O" : "X"}</p>}
      {current.kind === "short" && <p className="mt-3 text-sm font-bold">정답: {current.answer}</p>}
      {current.kind === "essay" && (
        <ol className="mt-3 space-y-2 text-sm font-bold">
          {current.answer.map((line, answerIndex) => (
            <li key={line} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#58cc02]">
                {answerIndex + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Notes({ activeSubject, sections }: { activeSubject: SubjectId; sections: ReturnType<typeof extractNoteSections> }) {
  return (
    <section className="space-y-5">
      {activeSubject === "wf2" && (
        <div className="grid gap-4">
          {webFramework2ExamTables.map((table) => (
            <article key={table.title} className="duo-card overflow-hidden">
              <h2 className="border-b-2 border-slate-100 bg-[#f7fbf2] px-4 py-3 text-base font-black">{table.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead className="bg-white text-slate-600">
                    <tr>
                      {table.columns.map((column) => (
                        <th key={column} className="border-b-2 border-slate-200 px-4 py-3 font-black">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={row.join("|")} className="odd:bg-[#f7fbf2]">
                        {row.map((cell) => (
                          <td key={cell} className="border-b border-slate-100 px-4 py-3 font-semibold leading-6">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="duo-card p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-black">{subjectLabels[activeSubject]} 노트</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">검색 조건에 맞는 원본 md 섹션입니다.</p>
          </div>
          <span className="rounded-md border-2 border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
            {sections.length}개 섹션
          </span>
        </div>
        <div className="mt-5 grid gap-4">
          {sections.length === 0 ? (
            <EmptyState />
          ) : (
            sections.map((section) => (
              <article key={`${section.level}-${section.title}`} className="rounded-lg border-2 border-slate-100 bg-[#f7fbf2] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>H{section.level}</Badge>
                  <h3 className="text-base font-black">{section.title}</h3>
                </div>
                <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-md bg-white p-3 text-sm font-semibold leading-6">
                  {section.body
                    .split(/\r?\n/)
                    .filter((line) => line.trim())
                    .slice(0, 18)
                    .join("\n")}
                </pre>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}

function Select({ label, value, onChange, children }: SelectProps) {
  return (
    <label className="grid gap-1.5 text-sm font-black">
      {label}
      <select
        className="duo-input px-3 py-2.5 text-sm font-bold"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function Badge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "rose" | "amber" | "slate" }) {
  const styles = {
    teal: "border-[#58cc02] bg-[#f1ffe8] text-[#46a302]",
    rose: "border-[#ff4b4b] bg-[#fff0f0] text-[#d92525]",
    amber: "border-[#ffc800] bg-[#fff8db] text-[#a76b00]",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };
  return <span className={cx("rounded-md border-2 px-2.5 py-1 text-xs font-black", styles[tone])}>{children}</span>;
}

function Stat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" | "amber" }) {
  const styles = {
    slate: "border-white/40 bg-white text-[#243042] shadow-[0_4px_0_rgba(0,0,0,0.12)]",
    rose: "border-white/40 bg-white text-[#ff4b4b] shadow-[0_4px_0_rgba(0,0,0,0.12)]",
    amber: "border-white/40 bg-white text-[#ffc800] shadow-[0_4px_0_rgba(0,0,0,0.12)]",
  };
  return (
    <div className={cx("min-w-24 rounded-lg border-2 px-3 py-2", styles[tone])}>
      <div className="text-xs font-black text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border-2 border-slate-100 bg-[#f7fbf2] px-2 py-2">
      <dt className="text-xs font-black text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-black">{value}</dd>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="duo-card p-8 text-center">
      <h2 className="text-lg font-black">조건에 맞는 항목이 없습니다</h2>
      <p className="mt-2 text-sm font-semibold text-slate-500">필터를 줄이거나 검색어를 바꿔보세요.</p>
    </div>
  );
}

export default App;
