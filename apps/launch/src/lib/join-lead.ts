import type { Lead } from "./lead-schema";
import type { PathwayState } from "./pathway-state";

/** The fields collected by the /join capture form. */
export interface JoinFormValues {
  name: string;
  email: string;
  phone: string;
}

/**
 * Assemble a submittable lead from the /join form values, the (optional) quiz
 * pathway state, and the buyer/list intent.
 *
 * If `state` is null (a deep-link to /join with no quiz state), the pathway is
 * `null` and the profile arrays are empty — capture must never be blocked.
 */
export function assembleLead(
  form: JoinFormValues,
  state: PathwayState | null,
  intent: Lead["intent"],
): Lead {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    pathway: state?.pathway ?? null,
    intent,
    dietary: state?.dietary ?? [],
    allergens: state?.allergens ?? [],
    foods: state?.foods ?? [],
    priorities: state?.priorities ?? [],
    ...(state?.reflectBody ? { reflectBody: state.reflectBody } : {}),
    ...(state?.reflectSoul ? { reflectSoul: state.reflectSoul } : {}),
  };
}
