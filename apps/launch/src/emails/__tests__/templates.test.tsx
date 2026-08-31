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
    const html = await render(
      <OrderConfirmationEmail
        accountUrl="https://www.soulgood.kitchen/account"
        bowls={[
          { name: "Glow Bowl™", quantity: 1 },
          { name: "Anti-Inflammatory Bowl™", quantity: 2 },
        ]}
        customerName="Avery Jones"
        fulfillment="LA County delivery"
        orderNumber="ABC12345"
        purchaseType="one-time"
        receiptUrl="https://square.example/receipt"
        subtotal="$88.00"
        tax="$9.45"
        total="$106.33"
      />,
    );
    expect(html).toContain("Your five are confirmed");
    expect(html).toContain("Anti-Inflammatory Bowl");
    expect(html).toContain("$106.33");
    expect(html).toContain("View my orders");
    expect(html).toContain("Square receipt");
  });
});
