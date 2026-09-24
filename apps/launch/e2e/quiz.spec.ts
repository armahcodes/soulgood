import { test, expect, type Page } from "@playwright/test";

async function answerAll(page: Page, singles: (string | RegExp)[], extras: Record<number, string> = {}) {
  await page.getByRole("button", { name: "I’m ready" }).click();
  for (const name of singles) {
    await page.getByRole("radio", { name }).click();
  }
  // Six optional steps: four multi-selects and two reflections.
  for (let step = 0; step < 6; step++) {
    const extra = extras[step];
    if (extra) await page.getByRole("button", { name: extra, exact: true }).click();
    await page.getByRole("button", { name: step === 5 ? "See my pathway" : "Continue" }).click();
  }
}

const PERFORMANCE = [
  "Busy but productive",
  /I'm building something/,
  "I need more stamina and lasting energy",
  "Building strength, endurance, or performance",
  "I need food that keeps up with my goals.",
];

test("homepage and navigation lead to the Pathway Finder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Find your pathway" }).first()).toHaveAttribute("href", "/quiz");
  await page.getByRole("link", { name: /Find your pathway/ }).first().click();
  await expect(page).toHaveURL(/\/quiz$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Take a breath.");
});

test("quiz requires contact details, captures the lead, and prefills checkout with an allergen-aware mix", async ({ page }) => {
  let lead: Record<string, unknown> | undefined;
  await page.route("**/api/lead", async (route) => {
    lead = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true, id: "test-lead" } });
  });

  await page.goto("/quiz");
  await answerAll(page, PERFORMANCE, { 1: "Sesame" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where should we send it?");
  await page.getByRole("button", { name: "Reveal my pathway" }).click();
  await expect(page.getByText("Name is required")).toBeVisible();
  expect(lead).toBeUndefined();

  await page.getByLabel("Full name").fill("Avery Jones");
  await page.getByLabel("Email").fill("avery@example.com");
  await page.getByLabel("Phone").fill("3105550100");
  await page.getByLabel("Delivery ZIP").fill("90012");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Reveal my pathway" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Performance");
  expect(lead).toMatchObject({ pathway: "performance", intent: "list", allergens: ["Sesame"] });
  await expect(page.getByText(/Left out for you:.*Golden Harvest Bowl™ \(label lists sesame\)/)).toBeVisible();

  await page.getByRole("button", { name: "Start with this mix" }).click();
  await expect(page).toHaveURL(/\/checkout\?fulfillment=delivery$/);
  const bowls = page.getByRole("group", { name: /Step 2 · Choose your bowls/ });
  await expect(bowls.locator('output[aria-label="2 Performance Power Bowl™ selected"]')).toBeVisible();
  await expect(bowls.locator('output[aria-label="0 Golden Harvest Bowl™ selected"]')).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("avery@example.com");
});

test("a failed save keeps the guest on the contact step with a retry", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/lead", (route) => {
    attempts++;
    return route.fulfill(attempts === 1 ? { status: 503, json: { ok: false } } : { json: { ok: true, id: "retry-lead" } });
  });
  await page.goto("/quiz");
  await answerAll(page, ["Slow and intentional", /sitting, studying/, "Calm and steady", "Being more present and reducing stress", "I want to slow down and nourish myself."]);
  await page.getByLabel("Full name").fill("Sam Lee");
  await page.getByLabel("Email").fill("sam@example.com");
  await page.getByLabel("Phone").fill("3105550199");
  await page.getByRole("radio", { name: /Pickup/ }).check();
  await page.getByRole("button", { name: "Reveal my pathway" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("couldn’t save your details");
  await page.getByRole("button", { name: "Reveal my pathway" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mindful");
  expect(attempts).toBe(2);
});
