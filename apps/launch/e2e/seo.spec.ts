import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "parallel" });
test.skip(({ isMobile }) => isMobile, "Metadata is identical on mobile");

const PUBLIC = ["/", "/menu", "/checkout", "/quiz", "/eat-now", "/quote", "/food-for-the-soul", "/food-for-the-soul/host", "/delivery", "/delivery/los-angeles", "/delivery/orange-county", "/delivery/long-beach", "/terms", "/customer-agreement", "/privacy", "/privacy-choices"];
const PRIVATE = ["/login", "/cancel", "/newsletter"];

for (const path of PUBLIC) {
  test(`${path} is indexable with complete metadata`, async ({ page }) => {
    await page.goto(path);
    const title = await page.title();
    expect(title).toMatch(/Soul Good/);
    expect(title.length).toBeLessThanOrEqual(70);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(50);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.soulgood.kitchen${path === "/" ? "" : path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator("h1")).toHaveCount(1);
    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(raw)).not.toThrow();
  });
}

for (const path of PRIVATE) {
  test(`${path} is kept out of search results`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
}

test("robots.txt, sitemap, and llms.txt describe the public site", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain("Sitemap: https://www.soulgood.kitchen/sitemap.xml");
  expect(robots).not.toMatch(/Disallow: \/account/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of PUBLIC) expect(sitemap).toContain(`<loc>https://www.soulgood.kitchen${path === "/" ? "" : path}</loc>`);
  for (const path of PRIVATE) expect(sitemap).not.toContain(`kitchen${path}<`);
  expect(sitemap).toContain("image:loc");
  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toMatch(/^# Soul Good/);
  expect(llms).toContain("$50 minimum");
});

test("the home page describes the business and its FAQs for search", async ({ page }) => {
  await page.goto("/");
  const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((raw) => {
    const data = JSON.parse(raw);
    return (data["@graph"] ?? [data]).map((node: { "@type": string }) => node["@type"]);
  });
  expect(types).toEqual(expect.arrayContaining(["Organization", "FoodEstablishment", "WebSite", "FAQPage"]));
});
