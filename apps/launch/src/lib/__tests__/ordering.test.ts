import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Button } from "@/components/ui/Button";
import { EAT_NOW } from "../ordering";
import { FEES, NOURISHMENT, PRICING } from "../brand";

describe("Eat Now navigation", () => {
  it("distinguishes available Eat Now couriers from exclusive team meal-prep delivery without changing fees", () => {
    for (const provider of ["DoorDash", "Uber Eats", "Postmates", "a Soul Good courier"])
      expect(EAT_NOW.deliveryDetails).toContain(provider);
    expect(EAT_NOW.deliveryDetails).toContain("depending on availability");
    expect(EAT_NOW.availability).toContain("your total at Eat Now checkout before paying");
    expect(NOURISHMENT.deliveryDisclosure).toContain("exclusively by the Soul Good team");
    expect(NOURISHMENT.deliveryDisclosure).toContain("not third-party couriers");
    expect(FEES.delivery.amountCents).toBe(888);
    expect(PRICING.weeklyCents).toBe(8800);
  });

  it("uses the published menu with no customer data or checkout tokens", () => {
    const url = new URL(EAT_NOW.menuUrl);
    expect(url.origin).toBe("https://checkout.soulgood.kitchen");
    expect(url.pathname).toBe("/s/order");
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
  });

  it("returns to a help page on the main site, not a payment-success route", () => {
    const url = new URL(EAT_NOW.returnUrl);
    expect(url.origin).toBe("https://www.soulgood.kitchen");
    expect(url.pathname).toBe(EAT_NOW.infoPath);
    expect(url.hash).toBe("#order-help");
  });

  it("allows same-tab menu navigation while preserving existing external-link defaults", () => {
    const menu = renderToStaticMarkup(createElement(Button, { as: "a", href: EAT_NOW.menuUrl, target: "_self" }, "Eat Now"));
    expect(menu).toContain('target="_self"');
    const existing = renderToStaticMarkup(createElement(Button, { as: "a", href: "https://example.com" }, "External"));
    expect(existing).toContain('target="_blank"');
    expect(existing).toContain('rel="noopener noreferrer"');
  });
});
