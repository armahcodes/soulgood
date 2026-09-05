import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://localhost:3109", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3109",
    url: "http://localhost:3109/checkout",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      SQUARE_APPLICATION_ID: "mock-app",
      SQUARE_LOCATION_ID: "mock-location",
      SQUARE_ENVIRONMENT: "sandbox",
      SQUARE_ACCESS_TOKEN: "",
      MONGODB_URI: "",
      RESEND_API_KEY: "",
      BETTER_AUTH_SECRET: "e2e-only-secret-not-for-any-real-environment",
    },
  },
});
