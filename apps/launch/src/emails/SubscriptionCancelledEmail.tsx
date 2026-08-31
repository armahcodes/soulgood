import { Button, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

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
    <EmailLayout preview="Your Soul Bowls weekly plan cancellation is scheduled">
      <Text style={emailStyles.eyebrow}>Cancellation scheduled</Text>
      <Text style={emailStyles.heading}>Future renewals are stopped.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, your Soul Bowls™ weekly plan will end on {effectiveDate}.
        Square will not renew the plan after that date. Any order already charged
        and committed to production remains active.
      </Text>
      <Button href={accountUrl} style={emailStyles.button}>View account</Button>
    </EmailLayout>
  );
}
