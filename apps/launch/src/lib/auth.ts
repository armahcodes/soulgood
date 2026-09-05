import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins";
import { sendAuthCodeEmail } from "./email";
import { getMongoDatabase } from "./db/mongodb";
import { hasStrongSecret } from "./strong-secret";

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!hasStrongSecret(secret))
    throw new Error(
      "A strong BETTER_AUTH_SECRET is required for authentication",
    );
  const { client, db } = getMongoDatabase();
  const previewHost =
    process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
  return betterAuth({
    appName: "Soul Bowls",
    baseURL: {
      allowedHosts: [
        "www.soulgood.kitchen",
        "soulgood.kitchen",
        ...(previewHost ? [previewHost] : []),
        ...(process.env.NODE_ENV !== "production" ? ["localhost:*"] : []),
      ],
      fallback: "https://www.soulgood.kitchen",
      protocol: "auto",
    },
    database: mongodbAdapter(db, { client }),
    secret,
    trustedOrigins: [
      "https://www.soulgood.kitchen",
      "https://soulgood.kitchen",
      ...(previewHost ? [`https://${previewHost}`] : []),
      ...(process.env.NODE_ENV !== "production"
        ? [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
          ]
        : []),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: {
      storage: "database",
      enabled: true,
      window: 60,
      max: 10,
    },
    advanced: {
      cookiePrefix: "soul-good",
      database: { joins: true },
      trustedProxyHeaders: true,
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: [
      emailOTP({
        allowedAttempts: 3,
        disableSignUp: false,
        expiresIn: 60 * 10,
        otpLength: 6,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          if (type !== "sign-in") return;
          await sendAuthCodeEmail({ email, otp });
        },
      }),
    ],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (instance ??= createAuth());
}
