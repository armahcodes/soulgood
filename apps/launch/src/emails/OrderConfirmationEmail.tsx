import { Button, Hr, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

export type EmailBowlSelection = { name: string; quantity: number };

export function OrderConfirmationEmail({
  accountUrl,
  bowlCount,
  bowlSubtotal,
  bowls,
  customerName,
  deliveryAddress,
  fulfillment,
  fulfillmentFee,
  mealsPerDay,
  orderNumber,
  peopleCount,
  purchaseType,
  receiptUrl,
  tax,
  total,
  paymentPending = false,
}: {
  accountUrl: string;
  bowlCount: number;
  bowlSubtotal: string;
  bowls: EmailBowlSelection[];
  customerName: string;
  deliveryAddress?: string;
  fulfillment: string;
  fulfillmentFee: string;
  mealsPerDay: number;
  orderNumber: string;
  peopleCount: number;
  purchaseType: "one-time" | "weekly";
  receiptUrl?: string;
  tax: string;
  total: string;
  paymentPending?: boolean;
}) {
  const weekly = purchaseType === "weekly";
  return (
    <EmailLayout
      preview={`${paymentPending ? "Plan enrolled — payment pending" : "Your Soul Bowls order is confirmed"} · ${orderNumber}`}
    >
      <Text style={emailStyles.eyebrow}>
        {paymentPending ? "Plan enrolled — payment pending" : "Order confirmed"}{" "}
        · {orderNumber}
      </Text>
      <Text style={emailStyles.heading}>
        {paymentPending
          ? "Your plan is enrolled."
          : `Your ${bowlCount} bowls are confirmed.`}
      </Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, thank you for choosing Soul Bowls™.{" "}
        {paymentPending
          ? "Square is processing your first invoice. This is not a payment receipt. We will confirm your bowls after payment clears."
          : `We’ll follow up with your Sunday ${fulfillment.toLowerCase()} window.`}
      </Text>

      <Section style={emailStyles.panel}>
        <Text style={emailStyles.label}>
          {peopleCount} {peopleCount === 1 ? "person" : "people"} ·{" "}
          {mealsPerDay} {mealsPerDay === 1 ? "meal" : "meals"} per person, per
          day · 5 days
        </Text>
        <Text style={emailStyles.label}>Your bowl mix</Text>
        {bowls.map((bowl) => (
          <Text key={bowl.name} style={rowStyle}>
            {bowl.name} <strong>× {bowl.quantity}</strong>
          </Text>
        ))}
        <Hr style={innerDividerStyle} />
        <Text style={priceRowStyle}>
          Bowl order <strong>{bowlSubtotal}</strong>
        </Text>
        <Text style={priceRowStyle}>
          {fulfillment} <strong>{fulfillmentFee}</strong>
        </Text>
        {deliveryAddress ? (
          <Text style={addressStyle}>Delivering to {deliveryAddress}</Text>
        ) : null}
        <Text style={priceRowStyle}>
          California sales tax <strong>{tax}</strong>
        </Text>
        <Text style={{ ...emailStyles.label, marginTop: "18px" }}>
          {paymentPending ? "Amount awaiting payment" : "Total paid"}
        </Text>
        <Text style={emailStyles.total}>{total}</Text>
      </Section>

      <Section style={ctaSectionStyle}>
        <Button href={accountUrl} style={emailStyles.button}>
          View my orders
        </Button>
        {receiptUrl ? (
          <Text style={{ ...emailStyles.muted, marginTop: "16px" }}>
            <a href={receiptUrl} style={receiptLinkStyle}>
              View Square receipt
            </a>
          </Text>
        ) : null}
      </Section>

      <Text style={emailStyles.muted}>
        {weekly
          ? "Your plan renews every seven days until canceled. Sign in to review the order or use the cancellation link in your account."
          : "This was a one-time purchase and will not renew automatically."}
      </Text>
    </EmailLayout>
  );
}

const rowStyle = {
  color: "#46534E",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "14px",
  lineHeight: "1.45",
  margin: "10px 0",
};
const priceRowStyle = { ...rowStyle, margin: "7px 0" };
const addressStyle = { ...emailStyles.muted, margin: "4px 0 12px" };
const innerDividerStyle = { borderColor: "#ECD6BC", margin: "18px 0" };
const ctaSectionStyle = { padding: "28px 0 24px", textAlign: "left" as const };
const receiptLinkStyle = { color: "#C17A5E", textDecoration: "underline" };
