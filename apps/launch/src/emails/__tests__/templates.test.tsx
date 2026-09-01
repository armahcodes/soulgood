import { describe, expect, it } from "vitest";
import { render } from "react-email";
import { AuthCodeEmail } from "../AuthCodeEmail";
import { OrderConfirmationEmail } from "../OrderConfirmationEmail";

describe("customer email templates", () => {
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
    expect(plainText).toContain("2 meals");
    expect(html).toContain("Anti-Inflammatory Bowl");
    expect(plainText).toContain("123 Main Street, Los Angeles, CA 90012");
    expect(html).toContain("$106.33");
    expect(html).toContain("View my orders");
    expect(html).toContain("Square receipt");
  });
});
