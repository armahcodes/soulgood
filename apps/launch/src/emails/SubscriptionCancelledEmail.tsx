import { Button, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";
import { formatCustomerDate } from "@/lib/customer-experience";

export function SubscriptionCancelledEmail({
  accountUrl,
  customerName,
  effectiveDate,
}: {
  accountUrl: string;
  customerName: string;
  effectiveDate: string;
}) {
  return (
    <EmailLayout preview="Your Soul Bowls weekly plan cancellation is confirmed">
      <Text style={emailStyles.eyebrow}>Cancellation confirmed</Text>
      <Text style={emailStyles.heading}>
        Your plan’s end date is confirmed.
      </Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, your Soul Bowls™ weekly plan will end on{" "}
        {formatCustomerDate(effectiveDate)}. Square will not renew the plan
        after that date. Any order already charged and committed to production
        remains active.
      </Text>
      <Text style={emailStyles.paragraph}>
        No further cancellation action is needed. You can still view your
        existing orders and receipts in your account.
      </Text>
      <Button href={accountUrl} style={emailStyles.button}>
        View my orders
      </Button>
    </EmailLayout>
  );
}
