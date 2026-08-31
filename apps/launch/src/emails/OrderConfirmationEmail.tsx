import { Button, Hr, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

export type EmailBowlSelection = { name: string; quantity: number };

export function OrderConfirmationEmail({
  accountUrl,
  bowls,
  customerName,
  fulfillment,
  orderNumber,
  purchaseType,
  receiptUrl,
  subtotal,
  tax,
  total,
}: {
  accountUrl: string;
  bowls: EmailBowlSelection[];
  customerName: string;
  fulfillment: string;
  orderNumber: string;
  purchaseType: "one-time" | "weekly";
  receiptUrl?: string;
  subtotal: string;
  tax: string;
  total: string;
}) {
  const weekly = purchaseType === "weekly";
  return (
    <EmailLayout
      preview={`${weekly ? "Your weekly plan is active" : "Your Soul Bowls order is confirmed"} · ${orderNumber}`}
    >
      <Text style={emailStyles.eyebrow}>
        {weekly ? "Weekly plan active" : "Order confirmed"} · {orderNumber}
      </Text>
      <Text style={emailStyles.heading}>Your five are confirmed.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, thank you for choosing Soul Bowls™. We’ll follow up
        with your Sunday {fulfillment.toLowerCase()} window.
      </Text>

      <Section style={emailStyles.panel}>
        <Text style={emailStyles.label}>Your bowl mix</Text>
        {bowls.map((bowl) => (
          <Text key={bowl.name} style={rowStyle}>
            {bowl.name} <strong>× {bowl.quantity}</strong>
          </Text>
        ))}
        <Hr style={innerDividerStyle} />
        <Text style={priceRowStyle}>Bowl order <strong>{subtotal}</strong></Text>
        <Text style={priceRowStyle}>{fulfillment} <strong>{fulfillment === "Pickup" ? "$0.00" : "$8.88"}</strong></Text>
        <Text style={priceRowStyle}>California sales tax <strong>{tax}</strong></Text>
        <Text style={{ ...emailStyles.label, marginTop: "18px" }}>
          {weekly ? "Weekly charge" : "Total paid"}
        </Text>
        <Text style={emailStyles.total}>{total}</Text>
      </Section>

      <Section style={ctaSectionStyle}>
        <Button href={accountUrl} style={emailStyles.button}>View my orders</Button>
        {receiptUrl ? (
          <Text style={{ ...emailStyles.muted, marginTop: "16px" }}>
            <a href={receiptUrl} style={receiptLinkStyle}>View Square receipt</a>
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
const innerDividerStyle = { borderColor: "#ECD6BC", margin: "18px 0" };
const ctaSectionStyle = { padding: "28px 0 24px", textAlign: "left" as const };
const receiptLinkStyle = { color: "#C17A5E", textDecoration: "underline" };
