import { Button, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

export function FulfillmentReminderEmail({
  accountUrl,
  customerName,
  fulfillmentDetails,
}: {
  accountUrl: string;
  customerName: string;
  fulfillmentDetails: string;
}) {
  return (
    <EmailLayout preview="Your Soul Bowls are almost ready">
      <Text style={emailStyles.eyebrow}>Sunday bowl ritual</Text>
      <Text style={emailStyles.heading}>Your bowls are almost ready.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, your five fresh Soul Bowls™ are being prepared.
      </Text>
      <Text style={emailStyles.paragraph}>{fulfillmentDetails}</Text>
      <Button href={accountUrl} style={emailStyles.button}>View my order</Button>
    </EmailLayout>
  );
}
