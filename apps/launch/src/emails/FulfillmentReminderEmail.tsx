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
    <EmailLayout preview="Your Soul Bowls™ are almost ready">
      <Text style={emailStyles.eyebrow}>From our kitchen, with care</Text>
      <Text style={emailStyles.heading}>Your bowls are almost ready.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {customerName}, we’re preparing your Soul Bowls™ with care. A little
        nourishment for the days ahead.
      </Text>
      <Text style={emailStyles.paragraph}>{fulfillmentDetails}</Text>
      <Button href={accountUrl} style={emailStyles.button}>View my order</Button>
    </EmailLayout>
  );
}
