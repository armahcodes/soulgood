import { describe, expect, it } from "vitest";
import { render } from "react-email";
import { AuthCodeEmail } from "../AuthCodeEmail";
import { OrderConfirmationEmail } from "../OrderConfirmationEmail";
import { CulinaryQuoteEmail } from "../CulinaryQuoteEmail";
import { SubscriptionCancelledEmail } from "../SubscriptionCancelledEmail";
import { CommunityInterestEmail } from "../CommunityInterestEmail";
import {
  balancedCulinarySelection,
  culinaryLineItems,
  culinaryPaymentSchedule,
  type CulinaryQuote,
  type CulinaryRequest,
} from "@/lib/culinary-booking";

describe("customer email templates", () => {
  it("renders actionable community inquiries, escaping visitor input", async () => {
    const email = (
      <CommunityInterestEmail
        interest={{
          id: "test",
          name: "Test Neighbor",
          email: "neighbor@example.com",
          interest: "host",
          community: "Long Beach",
          organization: "Community group",
          message: "<script>alert(1)</script>",
          consent: true,
          campaign: "food-for-the-soul-2026-10-15",
          capturedAt: "2026-09-19T10:00:00Z",
        }}
      />
    );
    const html = await render(email);
    const plain = await render(email, { plainText: true });
    expect(html).not.toContain("<script>");
    expect(html).toContain("#2C3A34");
    expect(plain).toContain("Long Beach");
    expect(plain).toContain("Bring a drive to my community");
    expect(plain).toContain("not a confirmed drive");
    expect(plain).toContain("October 15, 2026");
  });
  it("matches the confirmed cancellation UI and preserves the calendar end date", async () => {
    const plain = await render(
      <SubscriptionCancelledEmail
        accountUrl="https://www.soulgood.kitchen/account"
        customerName="Test Guest"
        effectiveDate="2026-09-20"
      />,
      { plainText: true },
    );
    expect(plain).toContain("Cancellation confirmed");
    expect(plain).toContain("September 20, 2026");
    expect(plain).toContain("No further cancellation action is needed");
    expect(plain).toContain("View my orders");
  });
  it.each(["customer", "team"] as const)(
    "renders the %s culinary request without promising a booking",
    async (audience) => {
      const quote: CulinaryQuote = {
        id: "fa0066bc-1ba4-4ed2-97a0-154076135c23",
        reference: "SG-TEST",
        input: {
          experience: "plated",
          guestCount: 10,
          bowlSelection: balancedCulinarySelection(10),
          eventDate: "2026-10-10",
          eventTime: "13:00",
          occasion: "Team lunch",
          address: {
            addressLine1: "123 Test Street",
            addressLine2: "Suite 2",
            city: "Los Angeles",
            state: "CA",
            postalCode: "90012",
          },
        },
        items: culinaryLineItems("plated", balancedCulinarySelection(10)),
        bowlCount: 10,
        subtotalCents: 106388,
        taxCents: 10373,
        totalCents: 116761,
        pricingVersion: 2,
        paymentSchedule: culinaryPaymentSchedule(116761, "2026-10-10"),
        taxPercentage: "9.75",
        jurisdiction: "Los Angeles",
        currency: "USD",
        createdAt: "2026-09-08T18:00:00Z",
        expiresAt: "2026-09-08T18:30:00Z",
      };
      const request: CulinaryRequest = {
        quoteId: quote.id,
        contact: {
          name: "Test Guest",
          email: "test@example.com",
          phone: "2135550100",
        },
        company: "Test Company",
        notes: "Sesame allergy <script>alert(1)</script>",
        acceptedEstimate: true,
      };
      const email = (
        <CulinaryQuoteEmail
          quote={quote}
          request={request}
          audience={audience}
        />
      );
      const html = await render(email);
      const plain = await render(email, { plainText: true });
      const groupQuote = {
        ...quote,
        input: {
          ...quote.input,
          platedMenu: "plant-forward" as const,
          bowlSelection: balancedCulinarySelection(0),
        },
      };
      groupQuote.items = culinaryLineItems(
        "plated",
        groupQuote.input.bowlSelection,
        groupQuote.input,
      );
      const groupEmail = await render(
        <CulinaryQuoteEmail
          quote={groupQuote}
          request={request}
          audience={audience}
        />,
        { plainText: true },
      );
      expect(groupEmail).toContain("Food style for the group: Plant-forward");
      expect(groupEmail).toContain(
        "confirm the final dishes and dietary requests",
      );
      expect(groupEmail).not.toContain("Glow Bowl");
      expect(html).toContain("#2C3A34");
      expect(html).not.toContain("<script>");
      for (const text of [
        "$55 per guest",
        "$555",
        "$500",
        "$5.00",
        "$1,167.61",
        "$583.81",
        "$583.80",
        "ingredient education",
        "2026-10-10",
        "13:00",
        "123 Test Street",
        "Suite 2",
        "test@example.com",
        "Sesame allergy",
        "not a confirmed reservation",
        "No payment has been taken",
      ])
        expect(plain).toContain(text);
    },
  );
  it("renders a branded one-time sign-in code message", async () => {
    const html = await render(<AuthCodeEmail code="482193" />);
    expect(html).toContain("SOUL GOOD");
    expect(html).toContain("482193");
    expect(html).toContain("expires in 10 minutes");
    expect(html).toContain("#2C3A34");
  });

  it("renders the complete order breakdown and account action", async () => {
    const email = (
      <OrderConfirmationEmail
        accountUrl="https://www.soulgood.kitchen/account"
        bowlCount={10}
        bowlSubtotal="$176.00"
        bowls={[
          { name: "Glow Bowl™", quantity: 1 },
          { name: "Anti-Inflammatory Bowl™", quantity: 2 },
        ]}
        customerName="Avery Jones"
        deliveryAddress="123 Main Street, Los Angeles, CA 90012"
        fulfillment="LA County delivery"
        fulfillmentFee="$8.88"
        mealsPerDay={2}
        orderNumber="ABC12345"
        peopleCount={1}
        purchaseType="one-time"
        receiptUrl="https://square.example/receipt"
        tax="$9.45"
        total="$106.33"
      />
    );
    const [html, plainText] = await Promise.all([
      render(email),
      render(email, { plainText: true }),
    ]);
    expect(plainText).toContain("Your 10 bowls are confirmed");
    expect(plainText).toContain(
      "thank you for making Soul Good part of your day",
    );
    expect(plainText).toContain("Your chosen bowls");
    expect(plainText).toContain(
      "one-time purchase and will not renew automatically",
    );
    expect(plainText).toContain("2 meals");
    expect(html).toContain("Anti-Inflammatory Bowl");
    expect(plainText).toContain("123 Main Street, Los Angeles, CA 90012");
    expect(html).toContain("$106.33");
    expect(html).toContain("View my orders");
    expect(html).toContain("Square receipt");
  });

  it("keeps pending payment and weekly renewal explicit in the warmer confirmation", async () => {
    const plain = await render(
      <OrderConfirmationEmail
        accountUrl="https://www.soulgood.kitchen/account"
        bowlCount={5}
        bowlSubtotal="$88.00"
        bowls={[{ name: "Glow Bowl™", quantity: 5 }]}
        customerName="Avery"
        fulfillment="LA County delivery"
        fulfillmentFee="$8.88"
        mealsPerDay={1}
        orderNumber="PENDING123"
        peopleCount={1}
        purchaseType="weekly"
        tax="$9.45"
        total="$106.33"
        paymentPending
      />,
      { plainText: true },
    );
    expect(plain).toContain("thank you for making Soul Good part of your day");
    expect(plain).toContain("This is not a payment receipt");
    expect(plain).toContain("Amount awaiting payment");
    expect(plain).toContain("renews every seven days until canceled");
    expect(plain).not.toContain("Total paid");
    expect(plain).not.toContain("Your 5 bowls are confirmed");
  });
});
