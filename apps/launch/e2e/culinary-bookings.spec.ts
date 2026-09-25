import { expect, test, type Page } from "@playwright/test";
import {
  culinaryLineItems,
  culinaryPaymentSchedule,
  culinaryServingCount,
  type CulinaryInput,
} from "../src/lib/culinary-booking";
import { bowlSelectionTotal } from "../src/lib/bowl-selection";

const quoteId = "fa0066bc-1ba4-4ed2-97a0-154076135c23";
function quote(input: CulinaryInput) {
  const items = culinaryLineItems(input.experience, input.bowlSelection, input);
  const subtotalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  const taxCents = Math.round(subtotalCents * 0.0975);
  return {
    id: quoteId,
    reference: "SG-TEST",
    input,
    items,
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    pricingVersion: 2,
    paymentSchedule: culinaryPaymentSchedule(
      subtotalCents + taxCents,
      input.eventDate,
    ),
    taxPercentage: "9.75",
    jurisdiction: "Los Angeles",
    currency: "USD",
    bowlCount: culinaryServingCount(input),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1800000).toISOString(),
  };
}
test.beforeEach(async ({ page }) => {
  // Never persist requests, send email, use live tax services, or charge a card in browser tests.
  await page.route("**/api/culinary-quotes**", async (route) => {
    if (route.request().url().endsWith("/request")) {
      await route.fulfill({
        status: 202,
        json: { received: true, reference: "SG-TEST" },
      });
    } else
      await route.fulfill({
        status: 201,
        json: { quote: quote(route.request().postDataJSON()) },
      });
  });
});

test("wizard shows one stage, keeps entered details when going back, and blocks unvisited steps", async ({
  page,
}, testInfo) => {
  await page.goto("/quote");
  const progress = page.getByRole("navigation", { name: "Quote progress" });
  await expect(
    progress.getByRole("button", { name: /Experience/ }),
  ).toHaveAttribute("aria-current", "step");
  await expect(
    progress.getByRole("button", { name: /Contact/ }),
  ).toBeDisabled();
  await expect(
    page.getByLabel("Event date", { exact: true }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: /Glow Bowl.*quantity/ }),
  ).not.toBeVisible();
  await expect(page.getByRole("complementary")).not.toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("wizard-experience.png"),
    fullPage: true,
    scale: "css",
  });
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(
    page.getByRole("radio", { name: /Bowl delivery/ }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: /Add one Glow Bowl/ }).click();
  await page.screenshot({
    path: testInfo.outputPath("wizard-menu.png"),
    fullPage: true,
    scale: "css",
  });
  await eventDetails(page);
  await page.getByLabel("Occasion optional").fill("Birthday gathering");
  await page.screenshot({
    path: testInfo.outputPath("wizard-event.png"),
    fullPage: true,
    scale: "css",
  });
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByText("11 bowls selected", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add event details", exact: true })
    .click();
  await expect(page.getByLabel("Occasion optional")).toHaveValue(
    "Birthday gathering",
  );
  await expect(
    page.getByLabel("Event street address", { exact: true }),
  ).toHaveValue("123 Test Street");
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your event estimate." }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Event date", { exact: true }),
  ).not.toBeVisible();
  await expect(page.getByLabel("Your name", { exact: true })).not.toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("wizard-review.png"),
    fullPage: true,
    scale: "css",
  });
  await contactDetails(page);
  await expect(
    page.getByRole("heading", { name: "Your event estimate." }),
  ).not.toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("wizard-contact.png"),
    fullPage: true,
    scale: "css",
  });
  await page
    .getByRole("button", { name: "Back to quote review", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continue to contact", exact: true })
    .click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Test Guest",
  );
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "test@example.com",
  );
});

test("an expired quote provides a way back to refresh without losing event details", async ({
  page,
}) => {
  let count = 0;
  await page.route("**/api/culinary-quotes", async (route) => {
    const result = quote(route.request().postDataJSON());
    if (count++ === 0)
      result.expiresAt = new Date(Date.now() - 1000).toISOString();
    await route.fulfill({ status: 201, json: { quote: result } });
  });
  await page.goto("/quote");
  await eventDetails(page);
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Continue to contact", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", {
      name: "Review event details & refresh",
      exact: true,
    })
    .click();
  await expect(
    page.getByLabel("Event street address", { exact: true }),
  ).toHaveValue("123 Test Street");
  await page
    .getByRole("button", { name: "Refresh my quote", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Continue to contact", exact: true }),
  ).toBeEnabled();
});

test("the old culinary URL redirects permanently to quote and preserves query parameters", async ({
  page,
  request,
}) => {
  const response = await request.get(
    "/culinary-bookings?source=existing-link",
    { maxRedirects: 0 },
  );
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/quote?source=existing-link");
  await page.goto("/culinary-bookings?source=existing-link");
  await expect(page).toHaveURL(/\/quote\?source=existing-link$/);
  await expect(
    page.getByRole("heading", { name: "Let’s plan your gathering." }),
  ).toBeVisible();
});

test("home and footer links point directly to quote", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("link", {
    name: "Culinary bookings",
    exact: true,
  });
  for (const link of await links.all())
    await expect(link).toHaveAttribute("href", "/quote");
  await expect(
    page.getByRole("link", { name: "Plan a gathering", exact: true }),
  ).toHaveAttribute("href", "/quote");
  await page
    .getByRole("link", { name: "Plan a gathering", exact: true })
    .click();
  await expect(page).toHaveURL(/\/quote$/);
  await expect(
    page.getByRole("heading", { name: "Let’s plan your gathering." }),
  ).toBeVisible();
});

async function eventDetails(page: Page) {
  if (
    await page
      .getByRole("button", { name: "Choose my menu", exact: true })
      .isVisible()
  )
    await page
      .getByRole("button", { name: "Choose my menu", exact: true })
      .click();
  if (
    await page
      .getByRole("button", { name: "Add event details", exact: true })
      .isVisible()
  )
    await page
      .getByRole("button", { name: "Add event details", exact: true })
      .click();
  const eventDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  await page.getByLabel("Event date", { exact: true }).fill(eventDate);
  await page
    .getByLabel("Preferred time (Los Angeles)", { exact: true })
    .fill("13:00");
  await page
    .getByLabel("Event street address", { exact: true })
    .fill("123 Test Street");
  await page.getByLabel("City", { exact: true }).fill("Los Angeles");
  await page.getByLabel("ZIP code", { exact: true }).fill("90012");
}
async function contactDetails(page: Page) {
  if (!(await page.getByLabel("Your name", { exact: true }).isVisible()))
    await page
      .getByRole("button", { name: "Continue to contact", exact: true })
      .click();
  await page.getByLabel("Your name", { exact: true }).fill("Test Guest");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Phone", { exact: true }).fill("2135550100");
}

test("delivery starts with 10 bowls, accepts individual quantities, and excludes sold-out recipes", async ({
  page,
}) => {
  await page.goto("/quote");
  await expect(
    page.getByRole("radio", { name: /Bowl delivery/ }),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(page.getByText("10 bowls selected")).toBeVisible();
  await expect(
    page.getByLabel("Running estimate").getByText("$184.88", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: /Herb Chicken/ }),
  ).toBeVisible();
  await expect(page.getByText(/Currently sold out/)).toHaveCount(0);
  await page.getByRole("button", { name: /Add one Glow Bowl/ }).click();
  await expect(page.getByText("11 bowls selected")).toBeVisible();
  await page.getByRole("button", { name: /Remove one Glow Bowl/ }).click();
  await page.getByRole("button", { name: /Remove one Glow Bowl/ }).click();
  await expect(
    page.getByRole("button", { name: "Add event details" }),
  ).toBeDisabled();
  await expect(
    page.getByText("Select at least 10 bowls for delivery."),
  ).toBeVisible();
  const glow = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: /Glow Bowl/ }) });
  await glow.getByText("Ingredients & details").click();
  await expect(
    page
      .getByRole("dialog")
      .getByText(/cannot guarantee an allergen-free kitchen/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    glow.getByRole("button", { name: /Ingredients & details/ }),
  ).toBeFocused();
});

test("guest count can be cleared and replaced one keystroke at a time", async ({ page }) => {
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  const guests = page.getByRole("spinbutton", { name: /How many guests/ });
  const next = page.getByRole("button", { name: "Choose my menu", exact: true });

  await expect(guests).toHaveValue("10");
  await guests.focus();
  await guests.press("End");
  await guests.press("Backspace");
  await guests.press("Backspace");
  await expect(guests).toHaveValue("");
  await expect(next).toBeDisabled();
  await guests.pressSequentially("2");
  await expect(guests).toHaveValue("2");
  await guests.pressSequentially("5");
  await expect(guests).toHaveValue("25");
  await expect(page.getByLabel("Running estimate")).toContainText("$1,883.88");
  await next.click();
  await expect(page.getByText("One menu for 25 guests · $55 per person")).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(guests).toHaveValue("25");
});

test("invalid guest counts stay editable and cannot bypass validation through wizard navigation", async ({ page }) => {
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  const guests = page.getByRole("spinbutton", { name: /How many guests/ });
  const next = page.getByRole("button", { name: "Choose my menu", exact: true });
  const progress = page.getByRole("navigation", { name: "Quote progress" });
  await next.click();
  await page.getByRole("button", { name: "Add event details", exact: true }).click();
  await progress.getByRole("button", { name: /Experience/ }).click();

  for (const value of ["", "0", "-2", "2.5", "10001"]) {
    await guests.fill(value);
    await guests.blur();
    await expect(guests).toHaveValue(value);
    await expect(guests).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Enter a whole number from 1 to 10,000 guests.", { exact: true })).toBeVisible();
    await expect(next).toBeDisabled();
    await expect(progress.getByRole("button", { name: /Menu/ })).toBeDisabled();
    await expect(progress.getByRole("button", { name: /Event/ })).toBeDisabled();
    await expect(page.getByLabel("Running estimate")).toContainText("Enter guests to see your estimate");
  }

  for (const value of ["1", "10000"]) {
    await guests.fill(value);
    await expect(next).toBeEnabled();
    await expect(guests).toHaveAttribute("aria-invalid", "false");
  }
  await guests.fill("");
  await page.getByRole("radio", { name: /Bowl delivery/ }).check();
  await expect(next).toBeEnabled();
});

test("plated chooses one food style for the group and prices by guests with support separately", async ({
  page,
}, testInfo) => {
  let savedInput: CulinaryInput | undefined;
  await page.route("**/api/culinary-quotes", async (route) => {
    savedInput = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { quote: quote(savedInput!) } });
  });
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  const summary = page.getByLabel("Running estimate");
  await expect(page.getByRole("complementary")).not.toBeVisible();
  await expect(
    summary.getByText("$1,063.88", { exact: true }).last(),
  ).toBeVisible();
  await page
    .getByRole("spinbutton", {
      name: "How many guests are you serving?",
      exact: false,
    })
    .fill("57");
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(
    page.getByText("One menu for 57 guests · $55 per person"),
  ).toBeVisible();
  await expect(page.getByRole("spinbutton")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Add one|Remove one|Swap/ }),
  ).toHaveCount(0);
  await page.getByRole("radio", { name: /^Plant-forward/ }).check();
  await page.screenshot({
    path: testInfo.outputPath("plated-food-style.png"),
    fullPage: true,
    scale: "css",
    animations: "disabled",
  });
  await expect(
    summary.getByText("$3,643.88", { exact: true }).last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  const guests = page.getByRole("spinbutton", { name: /How many guests/ });
  await guests.fill("");
  await guests.pressSequentially("20");
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(
    page.getByRole("radio", { name: /^Plant-forward/ }),
  ).toBeChecked();
  await expect(
    page.getByText("One menu for 20 guests · $55 per person"),
  ).toBeVisible();
  await expect(summary.getByText("$1,608.88", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add event details", exact: true }),
  ).toBeEnabled();
  await eventDetails(page);
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  const review = page.getByRole("complementary");
  expect(savedInput).toMatchObject({
    experience: "plated",
    guestCount: 20,
    platedMenu: "plant-forward",
  });
  expect(bowlSelectionTotal(savedInput!.bowlSelection)).toBe(0);
  await expect(
    review.getByText("Plant-forward", { exact: true }),
  ).toBeVisible();
  await expect(review.getByText("20 guests", { exact: true })).toBeVisible();
  await expect(review.getByText(/Glow Bowl/)).toHaveCount(0);
  await expect(review.getByText("$500.00", { exact: true })).toBeVisible();
  await expect(
    review.getByText("Culinary food minimum adjustment", { exact: true }),
  ).toHaveCount(0);
});

test("a complete quote requires acknowledgement, saves a request, and supports starting another", async ({
  page,
}) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/culinary-quotes/request", async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({
      status: 202,
      json: { received: true, reference: "SG-TEST" },
    });
  });
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  await eventDetails(page);
  await page.getByRole("button", { name: "Generate my quote" }).click();
  await expect(
    page.getByRole("heading", { name: "Your event estimate." }),
  ).toBeVisible();
  await expect(page.getByText("$1,167.61", { exact: true })).toBeVisible();
  await expect(page.getByText("$583.81", { exact: true })).toBeVisible();
  await expect(page.getByText("$583.80", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("complementary").getByText("$5.00", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary").getByText("$500.00", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Your name", { exact: true })).not.toBeVisible();
  await page
    .getByRole("button", { name: "Continue to contact", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Request this booking" }),
  ).toBeDisabled();
  await contactDetails(page);
  await page
    .getByRole("checkbox", { name: /not a confirmed reservation/ })
    .check();
  await page.getByRole("button", { name: "Request this booking" }).click();
  await expect(
    page.getByRole("heading", { name: "Request received." }),
  ).toBeVisible();
  await expect(page.getByText(/Your date is not reserved yet/)).toBeVisible();
  expect(submitted).toMatchObject({
    quoteId,
    contact: {
      name: "Test Guest",
      email: "test@example.com",
      phone: "2135550100",
    },
    acceptedEstimate: true,
  });
  expect(submitted).not.toHaveProperty("totalCents");
  await expect(page.getByLabel("Event date", { exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Start another quote" }).click();
  await expect(
    page.getByRole("heading", { name: /Choose your experience/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(
    page.getByRole("radio", { name: /^Chef’s selection/ }),
  ).toBeEnabled();
});

test("delivery presets can be undone and survive switching to a group menu", async ({
  page,
}) => {
  await page.goto("/quote");
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await page.getByRole("button", { name: /Add one Glow Bowl/ }).click();
  await page.getByLabel("Balanced menu size").selectOption("20");
  await expect(
    page.getByText("20 bowls selected", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByText("11 bowls selected", { exact: true }),
  ).toBeVisible();
  for (const photo of await page.getByRole("article").getByRole("img").all()) {
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await page.getByRole("radio", { name: /^Chicken/ }).check();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("radio", { name: /Bowl delivery/ }).check();
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  await expect(
    page.getByText("11 bowls selected", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: /Glow Bowl.*quantity/ }),
  ).toHaveValue("3");
});

test("editing the group food style invalidates the quote without losing event details", async ({
  page,
}) => {
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  await eventDetails(page);
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit menu", exact: true }).click();
  await page.getByRole("radio", { name: /^Chicken/ }).check();
  await expect(
    page
      .getByRole("navigation", { name: "Quote progress" })
      .getByRole("button", { name: /Review/ }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Add event details", exact: true })
    .click();
  await expect(
    page.getByLabel("Event street address", { exact: true }),
  ).toHaveValue("123 Test Street");
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  await expect(
    page.getByRole("complementary").getByText("Chicken", { exact: true }),
  ).toBeVisible();
});

test("address changes invalidate tax and a late response cannot restore the old quote", async ({
  page,
}) => {
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/culinary-quotes", async (route) => {
    const input = route.request().postDataJSON();
    await held;
    await route
      .fulfill({ status: 201, json: { quote: quote(input) } })
      .catch(() => {});
  });
  await page.goto("/quote");
  await eventDetails(page);
  const pending = page.waitForRequest("**/api/culinary-quotes");
  await page.getByRole("button", { name: "Generate my quote" }).click();
  await pending;
  await page
    .getByLabel("Event street address", { exact: true })
    .fill("456 New Street");
  release();
  await expect(
    page.getByRole("heading", { name: /Tell us where & when/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request this booking" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Generate my quote" }).click();
  await expect(
    page.getByRole("heading", { name: "Your event estimate." }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary").getByText("456 New Street"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit event details", exact: true })
    .click();
  await page.getByLabel("City", { exact: true }).fill("Pasadena");
  await expect(
    page.getByRole("heading", { name: /Tell us where & when/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue to contact", exact: true }),
  ).not.toBeVisible();
});

test("a lost request response retries the same quote and data without another estimate", async ({
  page,
}) => {
  const attempts: unknown[] = [];
  await page.route("**/api/culinary-quotes/request", async (route) => {
    attempts.push(route.request().postDataJSON());
    if (attempts.length === 1) await route.abort("connectionreset");
    else await route.fulfill({ status: 202, json: { received: true } });
  });
  await page.goto("/quote");
  await eventDetails(page);
  await page.getByRole("button", { name: "Generate my quote" }).click();
  await contactDetails(page);
  await page
    .getByRole("checkbox", { name: /not a confirmed reservation/ })
    .check();
  await page.getByRole("button", { name: "Request this booking" }).click();
  await expect(
    page.getByRole("complementary").getByRole("alert"),
  ).toContainText("Retry this request using the same quote");
  await page.getByRole("button", { name: "Request this booking" }).click();
  await expect(
    page.getByRole("heading", { name: "Request received." }),
  ).toBeVisible();
  expect(attempts).toHaveLength(2);
  expect(attempts[0]).toEqual(attempts[1]);
});

test("the quote is printable and the page fits narrow mobile screens", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === "mobile")
    await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  await eventDetails(page);
  await page.getByRole("button", { name: "Generate my quote" }).click();
  await expect(
    page.getByRole("heading", { name: "Your event estimate." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("culinary-quote.png"),
    fullPage: true,
    scale: "css",
  });
  await page.getByRole("complementary").screenshot({
    path: testInfo.outputPath("culinary-summary.png"),
    scale: "css",
  });
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("heading", { name: /Choose your experience/ }),
  ).not.toBeVisible();
  await expect(page.getByRole("complementary")).toBeVisible();
  await expect(page.getByText("$1,167.61", { exact: true })).toBeVisible();
});

test("group menu supports keyboard selection and stays within a 320px screen", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/quote");
  await page.getByRole("radio", { name: /Plated experience/ }).check();
  await page
    .getByRole("button", { name: "Choose my menu", exact: true })
    .click();
  // The wizard moves focus to the new step on the next tick; start from there.
  await expect(page.getByLabel("Step 2 of 5: Menu")).toBeFocused();
  const chef = page.getByRole("radio", { name: /^Chef’s selection/ });
  await chef.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("radio", { name: /^Plant-forward/ }),
  ).toBeChecked();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("plated-menu-320.png"),
    scale: "css",
    animations: "disabled",
  });
  await eventDetails(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Generate my quote", exact: true })
    .click();
  await contactDetails(page);
  await expect(
    page.getByRole("textbox", { name: /Dietary needs & event notes/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
