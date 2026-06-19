import { z } from "zod";

/** The four canonical pathways. The PDF typo "PERFOMANCE" maps to `performance`. */
export const PATHWAYS = ["mindful", "performance", "detox", "alignment"] as const;
export type Pathway = (typeof PATHWAYS)[number];

/**
 * Lenient phone validation. A real phone number typed on a phone keyboard may
 * include digits, `+`, spaces, hyphens, and parentheses. We require at least a
 * handful of digits so obviously empty/garbage input is rejected, but we do not
 * impose a strict format (capture-first; don't block a real guest).
 */
const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .refine((value) => /^[+\d\s().-]+$/.test(value), {
    message: "Phone contains invalid characters",
  })
  .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 7, {
    message: "Phone must include a valid number",
  });

/**
 * Zod schema for a captured lead. Name, email, and phone are required (the
 * mission goal is name + email + phone on file). All quiz-profile fields are
 * optional/defaulted so a deep-linked `/join` submit with no quiz state still
 * captures.
 */
export const leadSchema = z.object({
  email: z.email("Enter a valid email").trim().min(1, "Email is required"),
  phone: phoneSchema,
  name: z.string().trim().min(1, "Name is required"),
  pathway: z.enum(PATHWAYS).nullable().default(null),
  intent: z.enum(["buyer", "list"]),
  dietary: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  foods: z.array(z.string()).default([]),
  priorities: z.array(z.string()).default([]),
  reflectBody: z.string().optional(),
  reflectSoul: z.string().optional(),
});

/** A validated lead (pre-persistence; `id` + `capturedAt` are stamped on capture). */
export type Lead = z.infer<typeof leadSchema>;
