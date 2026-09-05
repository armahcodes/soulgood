import { Resend } from "resend";
import { AuthCodeEmail } from "@/emails/AuthCodeEmail";
import { ExchangeUpdateEmail } from "@/emails/ExchangeUpdateEmail";
import { FulfillmentReminderEmail } from "@/emails/FulfillmentReminderEmail";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import { SubscriptionCancelledEmail } from "@/emails/SubscriptionCancelledEmail";
import { type BowlSelection } from "./bowl-selection";
import {
  formatCents,
  FULFILLMENT,
  type FulfillmentMethod,
  type PurchaseType,
} from "./brand";
import { CURRENT_BOWLS } from "./current-offer";
import { EmailLayout, emailStyles } from "@/emails/EmailLayout";
import { Button, Text } from "react-email";

const ACCOUNT_URL = "https://www.soulgood.kitchen/account";
const DEFAULT_FROM = "Soul Good <orders@send.soulgood.kitchen>";
const REPLY_TO = "contact@soulgood.com";

function resendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

function sender(): string {
  return process.env.SOUL_GOOD_EMAIL_FROM || DEFAULT_FROM;
}

export async function sendPaymentUpdateEmail(input: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  status: string;
}): Promise<string> {
  const message =
    input.status === "REFUNDED"
      ? "Square reports that your payment has been refunded."
      : input.status === "PARTIALLY_REFUNDED"
        ? "Square reports a partial refund on your payment."
        : "Square did not complete this payment. Please review your account or contact us before placing the same order again.";
  return assertSent(
    await resendClient().emails.send(
      {
        from: sender(),
        to: input.customerEmail,
        replyTo: REPLY_TO,
        subject: "An update about your Soul Bowls payment",
        react: (
          <EmailLayout preview="Your payment status has changed">
            <Text style={emailStyles.heading}>A payment update.</Text>
            <Text style={emailStyles.paragraph}>
              Hi {input.customerName}, {message}
            </Text>
            <Button href={ACCOUNT_URL} style={emailStyles.button}>
              View my orders
            </Button>
          </EmailLayout>
        ),
      },
      { idempotencyKey: `payment-update/${input.orderId}/${input.status}` },
    ),
  );
}

function assertSent(
  result: Awaited<ReturnType<Resend["emails"]["send"]>>,
): string {
  if (result.error) throw new Error(result.error.message);
  if (!result.data?.id) throw new Error("Resend did not return an email id");
  return result.data.id;
}

export async function sendAuthCodeEmail(input: {
  email: string;
  otp: string;
}): Promise<string> {
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: input.email,
      replyTo: REPLY_TO,
      subject: `${input.otp} is your Soul Bowls sign-in code`,
      react: <AuthCodeEmail code={input.otp} />,
      tags: [{ name: "category", value: "authentication" }],
    },
    { idempotencyKey: `auth-code/${input.email.toLowerCase()}/${input.otp}` },
  );
  return assertSent(result);
}

export async function sendOrderConfirmationEmail(input: {
  bowlSelection: BowlSelection;
  customerEmail: string;
  customerName: string;
  deliveryAddress?: string;
  fulfillmentMethod: FulfillmentMethod;
  mealsPerDay: number;
  peopleCount: number;
  purchaseType: PurchaseType;
  receiptUrl?: string;
  squareObjectId: string;
  subtotalCents: number;
  fulfillmentFeeCents?: number;
  taxCents: number;
  totalCents: number;
  paymentPending?: boolean;
}): Promise<string> {
  const bowls = CURRENT_BOWLS.flatMap((bowl) => {
    const quantity = input.bowlSelection[bowl.id];
    return quantity > 0 ? [{ name: bowl.name, quantity }] : [];
  });
  const orderNumber = input.squareObjectId.slice(-8).toUpperCase();
  const fulfillmentFee =
    input.fulfillmentFeeCents ??
    FULFILLMENT[input.fulfillmentMethod].amountCents;
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: input.customerEmail,
      replyTo: REPLY_TO,
      subject: input.paymentPending
        ? `Your Soul Bowls plan is enrolled · payment pending · ${orderNumber}`
        : `Your Soul Bowls order is confirmed · ${orderNumber}`,
      react: (
        <OrderConfirmationEmail
          accountUrl={ACCOUNT_URL}
          bowls={bowls}
          bowlCount={bowls.reduce((count, bowl) => count + bowl.quantity, 0)}
          bowlSubtotal={formatCents(input.subtotalCents - fulfillmentFee)}
          customerName={input.customerName}
          deliveryAddress={input.deliveryAddress}
          fulfillment={
            input.fulfillmentMethod === "delivery"
              ? "LA County delivery"
              : "Pickup"
          }
          fulfillmentFee={formatCents(fulfillmentFee)}
          mealsPerDay={input.mealsPerDay}
          orderNumber={orderNumber}
          peopleCount={input.peopleCount}
          purchaseType={input.purchaseType}
          paymentPending={input.paymentPending}
          receiptUrl={input.receiptUrl}
          tax={formatCents(input.taxCents)}
          total={formatCents(input.totalCents)}
        />
      ),
      tags: [
        { name: "category", value: "order-confirmation" },
        { name: "purchase", value: input.purchaseType },
      ],
    },
    { idempotencyKey: `order-confirmation/${input.squareObjectId}` },
  );
  return assertSent(result);
}

export async function sendFulfillmentReminderEmail(input: {
  customerEmail: string;
  customerName: string;
  fulfillmentDetails: string;
  orderId: string;
}): Promise<string> {
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: input.customerEmail,
      replyTo: REPLY_TO,
      subject: "Your Soul Bowls are almost ready",
      react: (
        <FulfillmentReminderEmail
          accountUrl={ACCOUNT_URL}
          customerName={input.customerName}
          fulfillmentDetails={input.fulfillmentDetails}
        />
      ),
      tags: [{ name: "category", value: "fulfillment-reminder" }],
    },
    { idempotencyKey: `fulfillment-reminder/${input.orderId}` },
  );
  return assertSent(result);
}

export async function sendSubscriptionCancelledEmail(input: {
  customerEmail: string;
  customerName: string;
  effectiveDate: string;
  subscriptionId: string;
}): Promise<string> {
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: input.customerEmail,
      replyTo: REPLY_TO,
      subject: "Your Soul Bowls weekly plan cancellation is scheduled",
      react: (
        <SubscriptionCancelledEmail
          accountUrl={ACCOUNT_URL}
          customerName={input.customerName}
          effectiveDate={input.effectiveDate}
        />
      ),
      tags: [{ name: "category", value: "subscription-cancellation" }],
    },
    { idempotencyKey: `subscription-cancellation/${input.subscriptionId}` },
  );
  return assertSent(result);
}

export async function sendExchangeUpdateEmail(input: {
  customerEmail: string;
  customerName: string;
  caseId: string;
  updateId: string;
  update: string;
}): Promise<string> {
  const result = await resendClient().emails.send(
    {
      from: sender(),
      to: input.customerEmail,
      replyTo: REPLY_TO,
      subject: "An update about your Soul Bowls exchange",
      react: (
        <ExchangeUpdateEmail
          accountUrl={ACCOUNT_URL}
          customerName={input.customerName}
          update={input.update}
        />
      ),
      tags: [{ name: "category", value: "exchange-update" }],
    },
    { idempotencyKey: `exchange-update/${input.caseId}/${input.updateId}` },
  );
  return assertSent(result);
}
