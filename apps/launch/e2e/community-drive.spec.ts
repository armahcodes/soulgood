import { expect, test, type Page } from "@playwright/test";

async function fillInquiry(page: Page) {
  await page
    .getByLabel("Your name", { exact: true })
    .fill("Test Community Neighbor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("neighbor@example.com");
  await page
    .getByLabel("Community or city", { exact: true })
    .fill("Long Beach");
  await page.getByRole("checkbox").check();
}

test.beforeEach(async ({ page }) => {
  // No real inquiries, mail, orders, or payments are created by these tests.
  await page.route("**/api/community-interest", (route) =>
    route.fulfill({ status: 202, json: { received: true } }),
  );
});

test("campaign is discoverable from the homepage and shared footer", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Food for the Soul.*October 15/ })
    .click();
  await expect(page).toHaveURL(/\/food-for-the-soul$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Food for the Soul.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.soulgood.kitchen/food-for-the-soul",
  );
  await expect(
    page
      .getByRole("navigation", { name: "Legal and support" })
      .getByRole("link", { name: "Food for the Soul" }),
  ).toHaveAttribute("href", "/food-for-the-soul");
  await expect(page.getByText("100+", { exact: true })).toHaveCount(2);
  await expect(
    page.getByText("Meals provided by Soul Good", { exact: true }),
  ).toBeVisible();
});

test("host inquiry defaults correctly and succeeds only after acknowledgement", async ({
  page,
}) => {
  await page.goto("/food-for-the-soul");
  await page
    .getByRole("link", { name: "Bring a drive to your community" })
    .click();
  await expect(
    page.getByRole("radio", { name: /Bring a drive to my community/ }),
  ).toBeChecked();
  await fillInquiry(page);
  const request = page.waitForRequest("**/api/community-interest");
  await page.getByRole("button", { name: "Let’s connect" }).click();
  expect((await request).postDataJSON()).toMatchObject({
    interest: "host",
    community: "Long Beach",
    consent: true,
  });
  const success = page.getByRole("heading", {
    name: "You’re part of the conversation.",
  });
  await expect(success).toBeVisible();
  await expect(success).toBeFocused();
  await expect(
    page.getByText(/This isn’t a confirmed meal drive/),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Let’s connect" })).toHaveCount(
    0,
  );
});

test("validation focuses the missing field and optional city works for volunteers", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/community-interest", (route) => {
    requests++;
    return route.fulfill({ status: 202, json: { received: true } });
  });
  await page.goto("/food-for-the-soul#get-involved");
  await page.getByRole("button", { name: "Let’s connect" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  await expect(
    page.getByText("Please agree to be contacted about Food for the Soul."),
  ).toBeVisible();
  expect(requests).toBe(0);
  await page.getByLabel("Your name", { exact: true }).fill("Test Neighbor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("neighbor@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Let’s connect" }).click();
  await expect(
    page.getByLabel("Community or city", { exact: true }),
  ).toBeFocused();
  await page.getByRole("radio", { name: /Lend a hand/ }).check();
  await page.getByRole("button", { name: "Let’s connect" }).click();
  await expect(
    page.getByRole("heading", { name: "You’re part of the conversation." }),
  ).toBeVisible();
  expect(requests).toBe(1);
});

test("failed submission preserves details and permits a safe retry", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/community-interest", (route) => {
    requests++;
    return route.fulfill(
      requests === 1
        ? { status: 503, json: { error: "Please try again shortly." } }
        : { status: 202, json: { received: true } },
    );
  });
  await page.goto("/food-for-the-soul#get-involved");
  await fillInquiry(page);
  await page.getByRole("button", { name: "Let’s connect" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "Please try again shortly.",
  );
  await expect(page.getByLabel("Email address", { exact: true })).toHaveValue(
    "neighbor@example.com",
  );
  await expect(
    page.getByRole("heading", { name: "You’re part of the conversation." }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Let’s connect" }).click();
  await expect(
    page.getByRole("heading", { name: "You’re part of the conversation." }),
  ).toBeVisible();
  expect(requests).toBe(2);
});

test("sharing has an accessible fallback when clipboard access fails", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    }),
  );
  await page.goto("/food-for-the-soul");
  await page
    .getByRole("button", { name: "Share the good · Copy link" })
    .click();
  await expect(
    page.getByLabel("Copy this link to share the drive:"),
  ).toHaveValue("https://www.soulgood.kitchen/food-for-the-soul");
});

test("campaign content and email fallback are usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:3109/food-for-the-soul");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "email the Soul Good team" }),
    ).toHaveAttribute("href", /^mailto:/);
    await expect(
      page.getByRole("button", { name: "Let’s connect" }),
    ).toBeHidden();
  } finally {
    await context.close();
  }
});

test("responsive layout keeps content centered and actions usable", async ({
  page,
}, testInfo) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/food-for-the-soul");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    for (const action of [
      page.getByRole("link", { name: "Bring a drive to your community" }),
      page.getByRole("button", { name: "Let’s connect" }),
    ]) {
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    if (width < 768) {
      const heading = await page
        .getByRole("heading", { level: 1 })
        .boundingBox();
      expect(
        Math.abs(heading!.x + heading!.width / 2 - width / 2),
      ).toBeLessThan(2);
    }
    if (width >= 768) {
      const footerCopy = await page
        .getByRole("contentinfo")
        .getByText(/Thoughtfully prepared in Los Angeles/)
        .boundingBox();
      expect(footerCopy!.width).toBeGreaterThan(220);
    }
    if (width === 390 || width === 1440) {
      await page.screenshot({
        path: testInfo.outputPath(`community-${width}.png`),
        fullPage: true,
      });
      await page.screenshot({
        path: testInfo.outputPath(`community-hero-${width}.png`),
      });
    }
  }
});
