import { Button, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

export function ExchangeUpdateEmail({
  accountUrl,
  customerName,
  update,
}: {
  accountUrl: string;
  customerName: string;
  update: string;
}) {
  return (
    <EmailLayout preview="An update about your Soul Bowls exchange">
      <Text style={emailStyles.eyebrow}>Customer care update</Text>
      <Text style={emailStyles.heading}>We’re taking care of it.</Text>
      <Text style={emailStyles.paragraph}>Hi {customerName}, {update}</Text>
      <Button href={accountUrl} style={emailStyles.button}>View my orders</Button>
    </EmailLayout>
  );
}
