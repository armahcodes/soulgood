import { z } from "zod";

/** Privacy request and preference pieces safe for client components. */

export const PRIVACY_REQUEST_TYPES = [
  { value: "access", label: "Tell me what personal information you have about me" },
  { value: "copy", label: "Send me a copy of my personal information" },
  { value: "delete", label: "Delete my personal information" },
  { value: "correct", label: "Correct information you have about me" },
  { value: "opt-out", label: "Don’t sell or share my personal information" },
  { value: "limit", label: "Limit the use of my sensitive personal information (such as allergies)" },
  { value: "marketing", label: "Stop marketing emails" },
] as const;

export const PRIVACY_RESPONSE_DAYS = 45;

export const privacyRequestSchema = z
  .object({
    requestType: z.enum(PRIVACY_REQUEST_TYPES.map((item) => item.value) as [(typeof PRIVACY_REQUEST_TYPES)[number]["value"], ...(typeof PRIVACY_REQUEST_TYPES)[number]["value"][]], {
      error: "Choose what you’d like us to do.",
    }),
    name: z.string().trim().min(2, "Please enter your name.").max(120),
    email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email.").max(254)),
    relationship: z.enum(["self", "agent"]).default("self"),
    agentFor: z.string().trim().max(120).default(""),
    details: z.string().trim().max(2000).default(""),
    declaration: z.literal(true, { error: "Please confirm the information is accurate." }),
    website: z.string().max(0).default(""),
  })
  .superRefine((input, context) => {
    if (input.relationship === "agent" && input.agentFor.length < 2)
      context.addIssue({ code: "custom", path: ["agentFor"], message: "Enter the name of the person you’re acting for." });
    if (input.requestType === "correct" && input.details.length < 5)
      context.addIssue({ code: "custom", path: ["details"], message: "Tell us what should be corrected." });
  });
export type PrivacyRequest = z.infer<typeof privacyRequestSchema>;

/** Browser keys this site stores on your device (cart, quiz, last order), cleared by Privacy Choices. */
export const DEVICE_STORAGE_PREFIXES = ["soulbowls:", "sg_pathway_state"] as const;

export const PRIVACY_PREFERENCE_KEY = "sg_privacy";
