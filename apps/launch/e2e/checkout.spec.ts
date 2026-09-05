import { test, expect, type Page } from "@playwright/test";

const SDK = `window.Square = { payments: () => ({
  card: async () => { let node; return { attach: async (selector) => { node = document.createElement('input'); node.setAttribute('aria-label', 'Test card number'); document.querySelector(selector).appendChild(node); }, destroy: async () => { node?.remove(); return true; }, tokenize: async () => ({status:'OK',token:'mock-token'}) }; },
  applePay: async () => { throw new Error('unsupported test wallet'); },
  googlePay: async () => { let node; return { attach: async (selector) => { node = document.createElement('button'); node.type='button'; node.textContent='Google Pay'; document.querySelector(selector).appendChild(node); }, destroy: async () => {node?.remove();return true;}, tokenize: async () => ({status:'OK',token:'mock-wallet'}) }; },
  paymentRequest: (options) => options, verifyBuyer: async () => ({token:'mock-verified'})
}) };`;

const tax = () => ({
  subtotalCents: 9688,
  taxCents: 945,
  totalCents: 10633,
  percentage: "9.75",
  jurisdiction: "LOS ANGELES",
  county: "LOS ANGELES",
  quoteToken: "mock-signed-quote",
  expiresAt: Date.now() + 900_000,
});

test.beforeEach(async ({ page }) => {
  await page.route("**/v1/square.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: SDK }),
  );
  // No real backend, Square, MongoDB or email side effects are allowed in this suite.
  await page.route("**/api/checkout**", (route) =>
    route.fulfill({ status: 503, json: { pending: true } }),
  );
  await page.route("**/api/tax", (route) => route.fulfill({ json: tax() }));
});

async function details(page: Page) {
  await page
    .getByRole("textbox", { name: "First name", exact: true })
    .fill("Avery");
  await page
    .getByRole("textbox", { name: "Last name", exact: true })
    .fill("Jones");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("avery@example.com");
  await page
    .getByRole("textbox", { name: "Phone", exact: true })
    .fill("3105550100");
  await page
    .getByRole("textbox", { name: "Delivery street address" })
    .fill("123 Test Street");
  await page
    .getByRole("textbox", { name: "City", exact: true })
    .fill("Los Angeles");
  await page.getByRole("textbox", { name: "ZIP", exact: true }).fill("90012");
}

test("card reinitializes after reading terms without a full refresh", async ({
  page,
}) => {
  await page.goto("/checkout");
  await expect(
    page.getByRole("textbox", { name: "Test card number" }),
  ).toBeVisible();
  await page.evaluate(() => {
    (window as unknown as { testDocumentMarker: string }).testDocumentMarker =
      "original-document";
  });
  await page
    .getByRole("link", { name: "Terms of Service", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/terms$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole("textbox", { name: "Test card number" }),
  ).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { testDocumentMarker: string })
          .testDocumentMarker,
    ),
  ).toBe("original-document");
});

test("separate billing and cardholder reach checkout; reorder initializes again", async ({
  page,
}) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/checkout", async (route) => {
    const input = route.request().postDataJSON();
    submitted = input;
    await route.fulfill({
      json: {
        ok: true,
        purchaseType: "one-time",
        status: "COMPLETED",
        paymentId: "test-payment",
        orderId: "test-order",
        acceptedAt: new Date().toISOString(),
        fulfillmentMethod: input.fulfillmentMethod,
        mealsPerDay: input.mealsPerDay,
        peopleCount: input.peopleCount,
        bowlSelection: input.bowlSelection,
        tax: tax(),
      },
    });
  });
  await page.goto("/checkout");
  await details(page);
  await page
    .getByRole("checkbox", { name: /Use a different billing address/ })
    .check();
  await page
    .getByRole("textbox", { name: "Billing street address" })
    .fill("456 Billing Street");
  await page
    .getByRole("group", { name: "Billing address", exact: true })
    .getByRole("textbox", { name: "City", exact: true })
    .fill("New York");
  await page
    .getByRole("combobox", { name: "Billing state" })
    .selectOption("NY");
  await page
    .getByRole("group", { name: "Billing address", exact: true })
    .getByRole("textbox", { name: "ZIP" })
    .fill("10001");
  await page.getByRole("checkbox", { name: "Same as order contact" }).uncheck();
  await page
    .getByRole("textbox", { name: "Cardholder first name" })
    .fill("Bill");
  await page
    .getByRole("textbox", { name: "Cardholder last name" })
    .fill("Payer");
  await page
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await page.getByRole("checkbox", { name: /I authorize Soul Goods/ }).check();
  await page.getByRole("button", { name: /Pay by card/ }).click();
  await expect(page).toHaveURL(/welcome/);
  expect(submitted?.billingAddress).toMatchObject({
    state: "NY",
    postalCode: "10001",
  });
  expect(submitted?.billingName).toEqual({
    givenName: "Bill",
    familyName: "Payer",
  });
  await page
    .getByRole("button", { name: /Order.*again/i })
    .first()
    .click();
  await expect(
    page.getByRole("textbox", { name: "Test card number" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Test card number" }),
  ).toHaveCount(1);
});

test("a lost response locks repeat payment and recovers the same attempt after refresh", async ({
  page,
}) => {
  let attemptId = "";
  let checkoutCalls = 0;
  await page.route("**/api/checkout", async (route) => {
    checkoutCalls++;
    attemptId = route.request().postDataJSON().idempotencyKey;
    await route.abort("connectionreset");
  });
  await page.route("**/api/checkout/status", async (route) => {
    expect(route.request().postDataJSON().attemptId).toBe(attemptId);
    await route.fulfill({
      status: 202,
      json: { pending: true, message: "Verifying the original purchase" },
    });
  });
  await page.goto("/checkout");
  await details(page);
  await page
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await page.getByRole("checkbox", { name: /I authorize Soul Goods/ }).check();
  await page.getByRole("button", { name: /Pay by card/ }).click();
  await expect(
    page.getByRole("heading", { name: "Checking your purchase" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pay by card/ }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Checking your purchase" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Pay by card/ }),
  ).toBeDisabled();
  expect(checkoutCalls).toBe(1);
});

test("a late tax response does not restore a quote for the previous address", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/tax", async (route) => {
    await gate;
    await route.fulfill({ json: tax() }).catch(() => {});
  });
  await page.goto("/checkout");
  await details(page);
  await page
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "City", exact: true })
    .fill("Pasadena");
  release();
  await expect(
    page.getByRole("button", { name: "Calculate total", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Pay by card/ }),
  ).toBeDisabled();
  await expect(
    page.getByText("9.75% · LOS ANGELES", { exact: true }),
  ).toHaveCount(0);
});

test("checkout remains within the viewport and exposes the test wallet", async ({
  page,
}) => {
  await page.goto("/checkout");
  await details(page);
  await page
    .getByRole("button", { name: "Calculate total", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Google Pay", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
