import { expect, test } from "@playwright/test";

test("header navigation opens the full menu with every section", async ({ page }) => {
  await page.goto("/eat-now");
  // Desktop shows it in the header; phones show it in the tab bar.
  await expect(page.getByRole("link", { name: "Menu", exact: true }).first()).toHaveAttribute("href", "/menu");
  await page.goto("/menu");
  await expect(page.getByRole("heading", { level: 1, name: "Everything from our kitchen." })).toBeVisible();
  for (const name of ["Soul Bowls™", "Salads", "Veggie cups", "Something good between meals", "The wider Soul Good kitchen."])
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  await expect(page.getByRole("button", { name: /Rainbow Crunch, \$14\.00/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Crunch Cup, \$6\.00/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Jerk Cauliflower Bites, \$8\.00/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("build a salad, add a snack, and carry both into checkout", async ({ page }) => {
  await page.goto("/menu#salads");
  await page.getByRole("button", { name: "Build your salad" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByRole("heading", { name: "Build Your Own Salad" })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Make your choices" })).toBeDisabled();

  await sheet.getByText("Mixed cabbage and carrot slaw", { exact: true }).click();
  for (const topping of ["Sliced beets", "Roasted cauliflower", "Smoky sweet potatoes"])
    await sheet.getByRole("button", { name: topping }).click();
  await expect(sheet.getByRole("button", { name: "Sliced radishes" })).toHaveAttribute("aria-disabled", "true");
  await expect(sheet.getByText("3 of 3 chosen")).toBeVisible();
  await sheet.getByRole("button", { name: "Fresh mint" }).click();
  await sheet.getByText("Turmeric dressing", { exact: true }).click();
  await sheet.getByRole("button", { name: "One more Build Your Own Salad" }).click();
  await sheet.getByRole("button", { name: "Add to order · $30.00" }).click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);

  await page.getByRole("button", { name: /Crunch Cup, \$6\.00/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Add to order · $6.00" }).click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);

  await expect(page.getByText("$36.00 · review")).toBeVisible();
  await page.getByRole("link", { name: "Checkout", exact: true }).click();
  await expect(page).toHaveURL(/\/checkout/);

  const summary = page.locator("dl").filter({ hasText: "Order summary" });
  await expect(summary.getByText("Salads & snacks")).toBeVisible();
  await expect(summary.getByText("$36.00", { exact: true })).toBeVisible();
  await expect(page.getByText("Mixed cabbage and carrot slaw · Sliced beets, Roasted cauliflower, Smoky sweet potatoes · Fresh mint · Turmeric dressing")).toBeVisible();

  await page.getByRole("button", { name: "Remove Crunch Cup" }).click();
  await expect(summary.getByText("$30.00", { exact: true })).toBeVisible();
});
