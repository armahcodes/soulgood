import { z } from "zod";

export const COMMUNITY_DRIVE = {
  name: "Food for the Soul",
  path: "/food-for-the-soul",
  url: "https://www.soulgood.kitchen/food-for-the-soul",
  campaign: "food-for-the-soul-2026-10-15",
  date: "October 15, 2026",
  dateISO: "2026-10-15",
  impact: "100+",
} as const;

export const COMMUNITY_INTERESTS = [
  {
    value: "host",
    label: "Bring a drive to my community",
    description: "Let’s explore a meal drive where you are.",
  },
  {
    value: "volunteer",
    label: "Lend a hand",
    description: "Learn how to get involved with the drive.",
  },
  {
    value: "partner",
    label: "Partner with Soul Good",
    description: "Connect your organization with our mission.",
  },
  {
    value: "updates",
    label: "Learn about the next drive",
    description: "Hear more about October 15.",
  },
] as const;

export const communityInterestSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Please enter a valid email.").max(254)),
    interest: z.enum(["host", "volunteer", "partner", "updates"], {
      error: "Choose how you’d like to get involved.",
    }),
    community: z.string().trim().max(160).default(""),
    organization: z.string().trim().max(160).default(""),
    message: z
      .string()
      .trim()
      .max(1500, "Please keep your message under 1,500 characters.")
      .default(""),
    consent: z.literal(true, {
      error: "Please agree to be contacted about Food for the Soul.",
    }),
    website: z.string().max(0).default(""),
  })
  .superRefine((input, context) => {
    if (input.interest === "host" && input.community.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["community"],
        message: "Tell us your community or city.",
      });
    }
  });

export type CommunityInterest = z.infer<typeof communityInterestSchema>;
export type CommunityInterestKind = CommunityInterest["interest"];

export type CommunityInterestRecord = Omit<CommunityInterest, "website"> & {
  id: string;
  campaign: typeof COMMUNITY_DRIVE.campaign;
  capturedAt: string;
};
