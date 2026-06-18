import { PATHWAYS, type Pathway } from "./lead-schema";

/**
 * Pathway Finder quiz data + deterministic matching.
 *
 * All question prompts and option labels are transcribed VERBATIM from the
 * Pathway Finder PDF (`docs_new/Soul Good_Guide Questionnaire.pdf`). Two PDF
 * text-extraction artifacts are corrected to their clearly-intended spelling and
 * noted inline:
 *   - "amily-Friendly Options" → "Family-Friendly Options" (dropped leading F).
 *
 * ── Matching model ─────────────────────────────────────────────────────────
 * Only four questions are SCORED: season-of-life, energy, biggest-goal, and
 * "which statement feels most true". Each scored option contributes exactly one
 * point to a single pathway. The pathway with the most points wins.
 *
 * The "mornings" question is collected for tone/profile only and is NOT scored.
 *
 * The nutrition-profile questions (dietary lifestyles, allergens, foods-to-enjoy,
 * priorities) and the two reflection prompts feed the PROFILE, never the score.
 * This is a deliberate decision so that editing a dietary lifestyle can never
 * change the matched pathway (see `matchPathway` invariance test). The brief's
 * "sensible reinforcement" example — "improving digestion" → detox — is already
 * realized through the SCORED goal question option "Improving digestion and
 * feeling lighter" (mapped to `detox`), so no profile field needs to mutate the
 * score to honor it.
 *
 * Tie-break: when two or more pathways share the top score, the winner is the
 * first pathway in `TIE_BREAK_ORDER` (Alignment first — the balanced default —
 * then Mindful, Detox, Performance). This makes matching fully deterministic.
 */

export type QuestionType = "single" | "multi" | "text";

export interface QuizOption {
  /** Verbatim label; also the stored answer value. */
  value: string;
  /** Verbatim display label (identical to `value`). */
  label: string;
  /** Pathway this option scores toward (scored single-select questions only). */
  pathway?: Pathway;
  /** True for the free-text "Other: ____" option. */
  allowsCustom?: boolean;
}

export interface QuizQuestion {
  /** Stable key used in `QuizAnswers` and persisted profile. */
  id: QuestionId;
  /** Verbatim question prompt. */
  prompt: string;
  /** Optional verbatim helper line, e.g. "Choose up to three." */
  helper?: string;
  type: QuestionType;
  options?: QuizOption[];
  /** For multi-select questions, the maximum number of selections allowed. */
  maxSelections?: number;
  /** True when this question's option contributes to the pathway score. */
  scored?: boolean;
}

export type QuestionId =
  | "mornings"
  | "season"
  | "energy"
  | "goal"
  | "mostTrue"
  | "dietary"
  | "allergens"
  | "foods"
  | "priorities"
  | "reflectBody"
  | "reflectSoul";

/** The four scored question ids, in presentation order. */
export const SCORED_QUESTION_IDS: QuestionId[] = [
  "season",
  "energy",
  "goal",
  "mostTrue",
];

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "mornings",
    prompt: "How have your mornings been feeling lately?",
    type: "single",
    options: [
      { value: "Slow and intentional", label: "Slow and intentional" },
      { value: "Busy but productive", label: "Busy but productive" },
      {
        value: "A little sluggish and needing a reset",
        label: "A little sluggish and needing a reset",
      },
      { value: "Different every day", label: "Different every day" },
    ],
  },
  {
    id: "season",
    prompt: "Which of these sounds most like your current season of life?",
    type: "single",
    scored: true,
    options: [
      {
        value:
          "I spend most of my day sitting, studying, creating, driving, or working at a desk.",
        label:
          "I spend most of my day sitting, studying, creating, driving, or working at a desk.",
        pathway: "mindful",
      },
      {
        value:
          "I'm building something. Grad school, entrepreneurship, freelancing, creative projects, or a big life goal.",
        label:
          "I'm building something. Grad school, entrepreneurship, freelancing, creative projects, or a big life goal.",
        pathway: "performance",
      },
      {
        value: "I'm constantly on the move and juggling responsibilities.",
        label: "I'm constantly on the move and juggling responsibilities.",
        pathway: "performance",
      },
      {
        value:
          "I'm on my feet all day caring for others, teaching, serving, or working hands-on.",
        label:
          "I'm on my feet all day caring for others, teaching, serving, or working hands-on.",
        pathway: "performance",
      },
      {
        value: "I'm reconnecting with my health and creating healthier habits.",
        label: "I'm reconnecting with my health and creating healthier habits.",
        pathway: "detox",
      },
      {
        value:
          "My days look different every day and flexibility is important to me.",
        label:
          "My days look different every day and flexibility is important to me.",
        pathway: "alignment",
      },
    ],
  },
  {
    id: "energy",
    prompt: "How has your energy been throughout the day?",
    type: "single",
    scored: true,
    options: [
      { value: "Calm and steady", label: "Calm and steady", pathway: "mindful" },
      {
        value: "I need more stamina and lasting energy",
        label: "I need more stamina and lasting energy",
        pathway: "performance",
      },
      {
        value: "Heavy, sluggish, or drained",
        label: "Heavy, sluggish, or drained",
        pathway: "detox",
      },
      {
        value: "Up and down depending on the day",
        label: "Up and down depending on the day",
        pathway: "alignment",
      },
    ],
  },
  {
    id: "goal",
    prompt: "What is your biggest wellness goal right now?",
    type: "single",
    scored: true,
    options: [
      {
        value: "Being more present and reducing stress",
        label: "Being more present and reducing stress",
        pathway: "mindful",
      },
      {
        value: "Building strength, endurance, or performance",
        label: "Building strength, endurance, or performance",
        pathway: "performance",
      },
      {
        value: "Improving digestion and feeling lighter",
        label: "Improving digestion and feeling lighter",
        pathway: "detox",
      },
      {
        value: "Creating a wellness routine that fits my lifestyle",
        label: "Creating a wellness routine that fits my lifestyle",
        pathway: "alignment",
      },
    ],
  },
  {
    id: "mostTrue",
    prompt: "Which statement feels most true today?",
    type: "single",
    scored: true,
    options: [
      {
        value: "I want to slow down and nourish myself.",
        label: "I want to slow down and nourish myself.",
        pathway: "mindful",
      },
      {
        value: "I need food that keeps up with my goals.",
        label: "I need food that keeps up with my goals.",
        pathway: "performance",
      },
      {
        value: "I want to feel refreshed and renewed.",
        label: "I want to feel refreshed and renewed.",
        pathway: "detox",
      },
      {
        value: "I want food that adapts to my needs.",
        label: "I want food that adapts to my needs.",
        pathway: "alignment",
      },
    ],
  },
  {
    id: "dietary",
    prompt: "Do you follow any of the following dietary lifestyles?",
    type: "multi",
    options: [
      { value: "No specific preference", label: "No specific preference" },
      { value: "Plant-Based", label: "Plant-Based" },
      { value: "Vegetarian", label: "Vegetarian" },
      { value: "Pescatarian", label: "Pescatarian" },
      { value: "Halal", label: "Halal" },
      { value: "Gluten Conscious", label: "Gluten Conscious" },
      { value: "Dairy Conscious", label: "Dairy Conscious" },
      { value: "Low Sugar", label: "Low Sugar" },
      { value: "High Protein", label: "High Protein" },
      { value: "Anti-Inflammatory", label: "Anti-Inflammatory" },
      { value: "Other", label: "Other", allowsCustom: true },
    ],
  },
  {
    id: "allergens",
    prompt: "Do you have any food allergies or sensitivities?",
    type: "multi",
    options: [
      { value: "Dairy", label: "Dairy" },
      { value: "Eggs", label: "Eggs" },
      { value: "Gluten", label: "Gluten" },
      { value: "Soy", label: "Soy" },
      { value: "Peanuts", label: "Peanuts" },
      { value: "Tree Nuts", label: "Tree Nuts" },
      { value: "Fish", label: "Fish" },
      { value: "Shellfish", label: "Shellfish" },
      { value: "Sesame", label: "Sesame" },
      { value: "Other", label: "Other", allowsCustom: true },
      { value: "None", label: "None" },
    ],
  },
  {
    id: "foods",
    prompt: "Which foods would you like to enjoy more often?",
    type: "multi",
    options: [
      { value: "Fresh vegetables", label: "Fresh vegetables" },
      { value: "Fruit", label: "Fruit" },
      { value: "Seafood", label: "Seafood" },
      { value: "Chicken", label: "Chicken" },
      { value: "Plant-based proteins", label: "Plant-based proteins" },
      { value: "Southern comfort foods", label: "Southern comfort foods" },
      { value: "Smoothies and juices", label: "Smoothies and juices" },
      { value: "Breakfast options", label: "Breakfast options" },
      { value: "Chef's choice", label: "Chef's choice" },
    ],
  },
  {
    id: "priorities",
    prompt: "What matters most when choosing meals?",
    helper: "Choose up to three.",
    type: "multi",
    maxSelections: 3,
    options: [
      { value: "Flavor", label: "Flavor" },
      { value: "Convenience", label: "Convenience" },
      { value: "Energy", label: "Energy" },
      { value: "Protein", label: "Protein" },
      { value: "Weight Management", label: "Weight Management" },
      { value: "Digestive Health", label: "Digestive Health" },
      { value: "Stress Support", label: "Stress Support" },
      { value: "Better Sleep", label: "Better Sleep" },
      { value: "Variety", label: "Variety" },
      // PDF prints "amily-Friendly Options"; the leading F is dropped by the PDF
      // text layer. The intended label is "Family-Friendly Options".
      { value: "Family-Friendly Options", label: "Family-Friendly Options" },
    ],
  },
  {
    id: "reflectBody",
    prompt: "Right now, my body needs more:",
    type: "text",
  },
  {
    id: "reflectSoul",
    prompt: "Right now, my soul needs more:",
    type: "text",
  },
];

/** Lookup a question by id. */
export const QUESTIONS_BY_ID: Record<QuestionId, QuizQuestion> =
  QUESTIONS.reduce(
    (acc, q) => {
      acc[q.id] = q;
      return acc;
    },
    {} as Record<QuestionId, QuizQuestion>,
  );

/** The answers a guest provides across the quiz. All optional (capture-first). */
export interface QuizAnswers {
  /** Not scored — tone/profile only. */
  mornings?: string;
  season?: string;
  energy?: string;
  goal?: string;
  mostTrue?: string;
  dietary?: string[];
  allergens?: string[];
  foods?: string[];
  priorities?: string[];
  reflectBody?: string;
  reflectSoul?: string;
}

/**
 * Tie-break priority. When the top score is shared, the earliest pathway in this
 * list wins. Alignment is the balanced default (it represents "nourishment that
 * adapts"), making it the natural fallback when no single need dominates.
 */
export const TIE_BREAK_ORDER: Pathway[] = [
  "alignment",
  "mindful",
  "detox",
  "performance",
];

/** Map a chosen option value within a scored question to its pathway. */
function pathwayForAnswer(
  questionId: QuestionId,
  value: string | undefined,
): Pathway | undefined {
  if (!value) return undefined;
  const option = QUESTIONS_BY_ID[questionId].options?.find(
    (o) => o.value === value,
  );
  return option?.pathway;
}

/**
 * Deterministically match a guest's answers to one of the four pathways.
 *
 * Tallies one point per scored question (season, energy, goal, mostTrue) to the
 * pathway of the chosen option, then returns the highest-scoring pathway. Ties
 * (including the all-unanswered case, where every score is 0) resolve via
 * `TIE_BREAK_ORDER`. The result is ALWAYS one of the four canonical pathways and
 * is a pure function of the scored answers — profile fields never affect it.
 */
export function matchPathway(answers: QuizAnswers): Pathway {
  const scores: Record<Pathway, number> = {
    mindful: 0,
    performance: 0,
    detox: 0,
    alignment: 0,
  };

  for (const questionId of SCORED_QUESTION_IDS) {
    const value = answers[questionId];
    const pathway = pathwayForAnswer(
      questionId,
      typeof value === "string" ? value : undefined,
    );
    if (pathway) scores[pathway] += 1;
  }

  let winner: Pathway = TIE_BREAK_ORDER[0];
  let best = -Infinity;
  // Iterate in tie-break order so the first pathway reaching the max score wins.
  for (const pathway of TIE_BREAK_ORDER) {
    if (scores[pathway] > best) {
      best = scores[pathway];
      winner = pathway;
    }
  }
  return winner;
}

/** Re-export for convenience. */
export { PATHWAYS, type Pathway };
