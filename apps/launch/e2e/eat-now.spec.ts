import { expect, test } from "@playwright/test";
import { EAT_NOW } from "../src/lib/ordering";
import { NOURISHMENT } from "../src/lib/brand";

test.beforeEach(async ({ page }) => {
  // Never place live orders or initialize a production payment in this suite.
  await page.route("https://checkout.soulgood.kitchen/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Test menu</title><h1>Single-order menu</h1>",
    }),
  );
  await page.route("**/v1/square.js", (route) => route.abort());
  await page.route("**/api/checkout**", (route) =>
    route.fulfill({ status: 503, json: { pending: true } }),
  );
});

test("home separates Eat Now from five-bowl checkout on every screen", async ({ page }) => {
  await page.goto("/");
  const menuLink = page.getByRole("link", { name: "Eat Now · Single orders", exact: true }).last();
  await expect(menuLink).toHaveAttribute("href", EAT_NOW.menuUrl);
  await expect(menuLink).toHaveAttribute("target", "_self");
  await expect(page.getByRole("link", { name: "Build your ritual", exact: true }).last()).toHaveAttribute("href", "/checkout");
  await expect(page.getByRole("link", { name: "How Eat Now works" })).toHaveAttribute("href", EAT_NOW.infoPath);
  await menuLink.click();
  await expect(page).toHaveURL(EAT_NOW.menuUrl);
  await expect(page.getByRole("heading", { name: "Single-order menu" })).toBeVisible();
  expect(page.context().pages()).toHaveLength(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "How Eat Now works" })).toBeVisible();
});

test("Eat Now opens the live-menu destination without signup, personal data or cart transfer", async ({ page }) => {
  await page.goto("/eat-now?email=do-not-forward%40example.com&orderId=unverified&redirect=https://example.com");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A little good, whenever it fits.");
  await expect(page.getByText(EAT_NOW.deliveryDetails, { exact: true })).toBeVisible();
  await expect(page.getByText(NOURISHMENT.deliveryDisclosure, { exact: false })).toBeVisible();
  await expect(page.getByText(/Check available pickup and delivery times in the menu before ordering/)).toBeVisible();
  await expect(page.getByText(/select “One time”/)).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  const link = page.getByRole("link", { name: "Open the Eat Now menu", exact: true });
  await expect(link).toHaveAttribute("href", EAT_NOW.menuUrl);
  await link.click();
  await expect(page).toHaveURL(EAT_NOW.menuUrl);
  expect(page.context().pages()).toHaveLength(1);
});

test("the return page provides help, not an unverified payment-success screen", async ({ page }) => {
  await page.goto("/eat-now?status=COMPLETED&paid=true#order-help");
  await expect(page.getByRole("heading", { name: "Already ordered?" })).toBeVisible();
  await expect(page.getByText(/Your Square confirmation is the place to check/)).toBeVisible();
  await expect(page.getByText(/Your bowls are confirmed|Total paid|Payment successful/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Contact Soul Good", exact: true })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "Build your ritual" })).toHaveAttribute("href", "/checkout");
  await page.getByRole("link", { name: "Back to Soul Good", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("app delivery disclosures distinguish courier-based Eat Now from team-only meal prep", async ({ page }) => {
  for (const path of ["/eat-now", "/customer-agreement", "/terms"]) {
    await page.goto(path);
    await expect(page.getByText(EAT_NOW.deliveryDetails, { exact: true })).toBeVisible();
    await expect(page.getByText(NOURISHMENT.deliveryDisclosure, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/Our team prepares your food and handles delivery|Delivery is handled by our own team/)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  await page.goto("/eat-now");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /DoorDash, Uber Eats, or Postmates/);
  await expect(page.getByText(EAT_NOW.availability, { exact: true })).toBeVisible();
  await expect(page.getByText(/Eat Now has its own delivery availability and charges/)).toBeVisible();

  for (const path of ["/", "/checkout"]) {
    await page.goto(path);
    await expect(page.getByText(NOURISHMENT.deliveryDisclosure, { exact: false })).toBeVisible();
  }
  await expect(page.getByText(/in-house LA County delivery is \$8\.88/)).toBeVisible();
});

test("meal-plan checkout and the global footer expose the single-order menu", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Make this ritual yours." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Order from the Eat Now menu" })).toHaveAttribute("href", EAT_NOW.menuUrl);
  const footer = page.getByRole("navigation", { name: "Legal and support" });
  await expect(footer.getByRole("link", { name: "Eat Now menu", exact: true })).toHaveAttribute("href", EAT_NOW.menuUrl);
  await footer.getByRole("link", { name: "About Eat Now" }).click();
  await expect(page).toHaveURL(/\/eat-now$/);
});

test("brand-led invitations keep the scheduled offer and renewal terms clear", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Nourishment for your everyday.", { exact: true })).toBeVisible();
  await expect(page.getByText(/Five 32 oz bowls for \$88\. Order once or choose weekly delivery/)).toBeVisible();
  await expect(page.getByText(/subscription that renews every seven days until canceled/)).toBeVisible();
  await page.getByRole("link", { name: "Build your ritual", exact: true }).last().click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("heading", { name: "Make this ritual yours." })).toBeVisible();
  await expect(page.getByText(/Sunday pickup is free for one-time orders; in-house LA County delivery is \$8\.88/)).toBeVisible();
  await expect(page.getByRole("group", { name: /Step 2 · Choose your bowls/ })).toBeVisible();
});

test("Eat Now stays usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:3109/eat-now");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open the Eat Now menu", exact: true })).toHaveAttribute("href", EAT_NOW.menuUrl);
  } finally {
    await context.close();
  }
});

test("mobile and desktop layouts keep primary actions inside the viewport", async ({ page }, testInfo) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/eat-now"]) {
      await page.goto(path);
      const action = path === "/"
        ? page.getByRole("link", { name: "Eat Now · Single orders", exact: true }).last()
        : page.getByRole("link", { name: "Open the Eat Now menu", exact: true });
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const header = await page.locator("header").boundingBox();
      const firstHeading = await page.getByRole("heading", { level: 1 }).boundingBox();
      expect(firstHeading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
      if (width === 390 || width === 1440)
        await page.screenshot({ path: testInfo.outputPath(`${path === "/" ? "home" : "eat-now"}-${width}.png`), fullPage: true });
    }
  }
});
