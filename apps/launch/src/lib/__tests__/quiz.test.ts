import { describe, it, expect } from "vitest";
import {
  matchPathway,
  QUESTIONS,
  QUESTIONS_BY_ID,
  SCORED_QUESTION_IDS,
  TIE_BREAK_ORDER,
  type QuizAnswers,
} from "../quiz";
import { PATHWAYS, type Pathway } from "../lead-schema";

/** Pick the verbatim option value that scores toward `pathway` for a question. */
function optionFor(questionId: keyof typeof QUESTIONS_BY_ID, pathway: Pathway) {
  const option = QUESTIONS_BY_ID[questionId].options?.find(
    (o) => o.pathway === pathway,
  );
  if (!option) {
    throw new Error(`No ${pathway} option for ${String(questionId)}`);
  }
  return option.value;
}

/** Build an answer set where every scored question points to one pathway. */
function answersForPathway(pathway: Pathway): QuizAnswers {
  return {
    season: optionFor("season", pathway),
    energy: optionFor("energy", pathway),
    goal: optionFor("goal", pathway),
    mostTrue: optionFor("mostTrue", pathway),
  };
}

describe("quiz data integrity", () => {
  it("exposes all 11 questions in order", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual([
      "mornings",
      "season",
      "energy",
      "goal",
      "mostTrue",
      "dietary",
      "allergens",
      "foods",
      "priorities",
      "reflectBody",
      "reflectSoul",
    ]);
  });

  it("caps the priorities question at three selections", () => {
    expect(QUESTIONS_BY_ID.priorities.maxSelections).toBe(3);
    expect(QUESTIONS_BY_ID.priorities.helper).toBe("Choose up to three.");
  });

  it("scores exactly the four season/energy/goal/mostTrue questions", () => {
    expect(SCORED_QUESTION_IDS).toEqual(["season", "energy", "goal", "mostTrue"]);
    const scored = QUESTIONS.filter((q) => q.scored).map((q) => q.id);
    expect(scored).toEqual(["season", "energy", "goal", "mostTrue"]);
  });

  it("every scored option maps to a canonical pathway", () => {
    for (const id of SCORED_QUESTION_IDS) {
      for (const option of QUESTIONS_BY_ID[id].options ?? []) {
        expect(PATHWAYS).toContain(option.pathway);
      }
    }
  });

  it("morning, dietary, allergen, food and priority options are not scored", () => {
    for (const id of ["mornings", "dietary", "allergens", "foods", "priorities"] as const) {
      for (const option of QUESTIONS_BY_ID[id].options ?? []) {
        expect(option.pathway).toBeUndefined();
      }
    }
  });
});

describe("matchPathway — invariants", () => {
  it("always returns one of the four canonical pathways", () => {
    // Enumerate the full cross-product of scored single-select options.
    const seasonOpts = QUESTIONS_BY_ID.season.options ?? [];
    const energyOpts = QUESTIONS_BY_ID.energy.options ?? [];
    const goalOpts = QUESTIONS_BY_ID.goal.options ?? [];
    const mostTrueOpts = QUESTIONS_BY_ID.mostTrue.options ?? [];

    for (const s of seasonOpts) {
      for (const e of energyOpts) {
        for (const g of goalOpts) {
          for (const m of mostTrueOpts) {
            const result = matchPathway({
              season: s.value,
              energy: e.value,
              goal: g.value,
              mostTrue: m.value,
            });
            expect(PATHWAYS).toContain(result);
          }
        }
      }
    }
  });

  it("returns a valid pathway even with no answers", () => {
    expect(PATHWAYS).toContain(matchPathway({}));
  });

  it("is deterministic — same input yields same output", () => {
    const answers = answersForPathway("detox");
    const first = matchPathway(answers);
    for (let i = 0; i < 50; i++) {
      expect(matchPathway(answers)).toBe(first);
    }
  });
});

describe("matchPathway — representative mappings", () => {
  it("calm/present/slow-down → mindful", () => {
    expect(matchPathway(answersForPathway("mindful"))).toBe("mindful");
  });

  it("stamina/strength/keeps-up-with-goals → performance", () => {
    expect(matchPathway(answersForPathway("performance"))).toBe("performance");
  });

  it("sluggish/improving-digestion/refreshed → detox", () => {
    expect(matchPathway(answersForPathway("detox"))).toBe("detox");
  });

  it("up-and-down/fits-my-lifestyle/adapts-to-my-needs → alignment", () => {
    expect(matchPathway(answersForPathway("alignment"))).toBe("alignment");
  });

  it("a majority lean still wins despite one off-pathway answer", () => {
    // 3 mindful + 1 performance → mindful.
    const answers: QuizAnswers = {
      ...answersForPathway("mindful"),
      goal: optionFor("goal", "performance"),
    };
    expect(matchPathway(answers)).toBe("mindful");
  });
});

describe("matchPathway — documented tie-break", () => {
  it("uses TIE_BREAK_ORDER (alignment first) on an all-zero tie", () => {
    expect(matchPathway({})).toBe(TIE_BREAK_ORDER[0]);
    expect(matchPathway({})).toBe("alignment");
  });

  it("a 2-2 tie resolves to the earlier pathway in TIE_BREAK_ORDER", () => {
    // mindful (season, energy) vs performance (goal, mostTrue): 2-2.
    // TIE_BREAK_ORDER lists mindful before performance, so mindful wins.
    const answers: QuizAnswers = {
      season: optionFor("season", "mindful"),
      energy: optionFor("energy", "mindful"),
      goal: optionFor("goal", "performance"),
      mostTrue: optionFor("mostTrue", "performance"),
    };
    expect(matchPathway(answers)).toBe("mindful");
  });

  it("detox beats performance on a tie (detox precedes performance)", () => {
    const answers: QuizAnswers = {
      season: optionFor("season", "detox"),
      energy: optionFor("energy", "detox"),
      goal: optionFor("goal", "performance"),
      mostTrue: optionFor("mostTrue", "performance"),
    };
    expect(matchPathway(answers)).toBe("detox");
  });
});

describe("matchPathway — profile invariance", () => {
  it("toggling dietary/allergen/food/priority answers does not change the pathway", () => {
    const base = answersForPathway("performance");
    const withProfile: QuizAnswers = {
      ...base,
      mornings: "Slow and intentional",
      dietary: ["Plant-Based", "High Protein"],
      allergens: ["Peanuts", "Gluten"],
      foods: ["Fresh vegetables", "Smoothies and juices"],
      priorities: ["Energy", "Protein", "Variety"],
      reflectBody: "more rest",
      reflectSoul: "more calm",
    };
    expect(matchPathway(withProfile)).toBe(matchPathway(base));
    expect(matchPathway(withProfile)).toBe("performance");
  });

  it("a digestion-leaning profile cannot override a non-detox score", () => {
    // Profile screams "digestion" but the SCORED answers are all mindful.
    const answers: QuizAnswers = {
      ...answersForPathway("mindful"),
      priorities: ["Digestive Health"],
      dietary: ["Anti-Inflammatory"],
    };
    expect(matchPathway(answers)).toBe("mindful");
  });
});
