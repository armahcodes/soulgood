import { expect, test } from "@playwright/test";

test("legal pages link together and the footer offers privacy choices", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText(/We don’t sell your personal information/)).toBeVisible();
  await expect(page.getByText(/2450 Colorado Ave, Suite 100E, Santa Monica, CA 90404/).first()).toBeVisible();
  const footer = page.getByRole("contentinfo").getByRole("navigation", { name: "Legal and support" });
  await expect(footer.getByRole("link", { name: "Your Privacy Choices" })).toHaveAttribute("href", "/privacy-choices");
  await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /Food for the Soul community meal drives/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Pathway Finder and food information/ })).toBeVisible();
});

test("privacy choices save an opt-out, clear device data, and send a request", async ({ page }) => {
  let request: Record<string, unknown> | undefined;
  await page.route("**/api/privacy-requests", async (route) => {
    request = route.request().postDataJSON();
    await route.fulfill({ status: 202, json: { received: true, reference: "PR-TEST01" } });
  });
  await page.goto("/privacy-choices");
  await page.evaluate(() => sessionStorage.setItem("soulbowls:extras", "[]"));

  const optOut = page.getByRole("checkbox", { name: /Do not sell or share my personal information/ });
  await optOut.check();
  await expect(page.getByText("Saved: you’re opted out on this browser.")).toBeVisible();
  expect(await page.evaluate(() => document.cookie)).toContain("sg_privacy=optout");

  await page.getByRole("button", { name: "Clear saved data on this device" }).click();
  expect(await page.evaluate(() => sessionStorage.getItem("soulbowls:extras"))).toBeNull();

  const form = page.getByRole("region", { name: "Make a privacy request" });
  await form.getByRole("radio", { name: /Delete my personal information/ }).check();
  await form.getByRole("button", { name: "Send privacy request" }).click();
  await expect(form.getByText("Please enter your name.")).toBeVisible();
  await form.getByLabel("Your name").fill("Avery Jones");
  await form.getByLabel("Email you used with us").fill("avery@example.com");
  await form.getByRole("checkbox", { name: /information above is accurate/ }).check();
  await form.getByRole("button", { name: "Send privacy request" }).click();
  await expect(form.getByText(/Request received · PR-TEST01/)).toBeVisible();
  expect(request).toMatchObject({ requestType: "delete", email: "avery@example.com", relationship: "self", declaration: true });
});

test("newsletter signup is double opt-in and unsubscribe needs a button press", async ({ page }) => {
  let signup: Record<string, unknown> | undefined;
  await page.route("**/api/newsletter", async (route) => {
    signup = route.request().postDataJSON();
    await route.fulfill({ status: 202, json: { received: true } });
  });
  await page.route("**/api/newsletter/unsubscribe", (route) => route.fulfill({ json: { unsubscribed: true } }));
  await page.goto("/newsletter");
  const main = page.getByRole("main");
  await main.getByLabel("Newsletter email").fill("neighbor@example.com");
  await main.getByRole("button", { name: "Subscribe" }).click();
  await expect(main.getByText("Please confirm you’d like the newsletter.")).toBeVisible();
  expect(signup).toBeUndefined();
  await main.getByRole("checkbox", { name: /Send me the Soul Good newsletter/ }).check();
  await main.getByRole("button", { name: "Subscribe" }).click();
  await expect(main.getByText(/Check your inbox/)).toBeVisible();
  expect(signup).toMatchObject({ email: "neighbor@example.com", source: "newsletter-page", consent: true });

  await page.goto("/newsletter?unsubscribe=abcdefghijklmnopqrstuvwxyz0123456789");
  await expect(page.getByRole("heading", { level: 1, name: "Leave the newsletter?" })).toBeVisible();
  await page.getByRole("button", { name: "Unsubscribe from the newsletter" }).click();
  await expect(page.getByText(/You’re unsubscribed/)).toBeVisible();
});

test("organizations can apply to host an open, first-come, first-served meal drive", async ({ page }) => {
  let application: Record<string, unknown> | undefined;
  await page.route("**/api/meal-drive-applications", async (route) => {
    application = route.request().postDataJSON();
    await route.fulfill({ status: 202, json: { received: true, reference: "FFS-TEST01" } });
  });
  await page.goto("/food-for-the-soul");
  await page.getByRole("link", { name: /Organizations: apply to host a drive/ }).click();
  await expect(page).toHaveURL(/\/food-for-the-soul\/host$/);
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bring a meal drive to your community.");
  await expect(page.getByText("Meals are served first come, first served, while supplies last.")).toBeVisible();

  const form = page.locator("form").filter({ has: page.getByRole("navigation", { name: "Application progress" }) });
  await form.getByRole("button", { name: /Continue to community/ }).click();
  await expect(form.getByText("Please enter your organization’s name.")).toBeVisible();
  await form.getByLabel("Organization name").fill("Harbor Tenants Association");
  await form.getByLabel("Type of organization").selectOption("tenant");
  await form.getByLabel("Your name").fill("Jordan Lee");
  await form.getByLabel("Your role").fill("Organizer");
  await form.getByLabel("Email").fill("jordan@example.org");
  await form.getByLabel("Phone").fill("5625550100");
  await form.getByRole("button", { name: /Continue to community/ }).click();

  await form.getByLabel("Neighborhood or area you’ll serve").fill("West Long Beach");
  await form.getByLabel(/how many households/).fill("150");
  await form.getByText("Households nearby regularly run short on food").click();
  await form.getByRole("button", { name: /Continue to site & date/ }).click();

  await form.getByLabel("Street address").fill("100 Main St");
  await form.getByLabel("City").fill("Long Beach");
  await form.getByLabel("ZIP code").fill("90813");
  await form.getByText(/Restrooms or a handwashing station/).click();
  const date = new Date(Date.now() + 40 * 86_400_000).toISOString().slice(0, 10);
  await form.getByLabel("Preferred date").fill(date);
  await form.getByLabel("Volunteers you can bring").fill("8");
  await form.getByRole("button", { name: /Continue to commitments/ }).click();

  await expect(form.getByText(/Non-discrimination commitment/)).toBeVisible();
  await form.getByRole("button", { name: "Submit application" }).click();
  await expect(form.getByText("Please agree to be contacted about your application.")).toBeVisible();
  for (const box of await form.getByRole("checkbox").all()) await box.check();
  await form.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText("Reference FFS-TEST01")).toBeVisible();
  expect(application).toMatchObject({
    organizationName: "Harbor Tenants Association",
    needs: ["food-insecurity"],
    county: "Los Angeles",
    consent: true,
    commitments: { firstComeFirstServed: true, noEligibilityChecks: true, nonDiscrimination: true },
  });
  expect(JSON.stringify(application)).not.toMatch(/race|ethnic|religion|gender|income level/i);
});
