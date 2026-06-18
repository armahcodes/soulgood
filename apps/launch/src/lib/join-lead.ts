import type { Lead } from "./lead-schema";
import type { PathwayState } from "./pathway-state";

/** The two fields collected by the /join capture form. */
export interface JoinFormValues {
  email: string;
  phone: string;
}

/** The plan a guest can choose on /join. Phone + email are always captured. */
export type Plan = "subscription" | "one-time";

/**
 * Assemble a submittable lead from the /join form values, the (optional) quiz
 * pathway state, the buyer/list intent, and the chosen plan.
 *
 * If `state` is null (a deep-link to /join with no quiz state), the pathway is
 * `null` and the profile arrays are empty — capture must never be blocked.
 */
export function assembleLead(
  form: JoinFormValues,
  state: PathwayState | null,
  intent: Lead["intent"],
  plan: Plan,
): Lead {
  return {
    email: form.email.trim(),
    phone: form.phone.trim(),
    pathway: state?.pathway ?? null,
    intent,
    plan,
    dietary: state?.dietary ?? [],
    allergens: state?.allergens ?? [],
    foods: state?.foods ?? [],
    priorities: state?.priorities ?? [],
    ...(state?.reflectBody ? { reflectBody: state.reflectBody } : {}),
    ...(state?.reflectSoul ? { reflectSoul: state.reflectSoul } : {}),
  };
}
