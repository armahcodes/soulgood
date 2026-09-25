import { Button, Link, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

function UnsubscribeFooter({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <Text style={{ ...emailStyles.muted, fontSize: "12px", marginTop: "8px" }}>
      You’re receiving this because this address was entered for the Soul Good newsletter.{" "}
      <Link href={unsubscribeUrl} style={{ color: "#65716C", textDecoration: "underline" }}>
        Unsubscribe
      </Link>{" "}
      anytime, or manage choices at soulgood.kitchen/privacy-choices.
    </Text>
  );
}

export function NewsletterConfirmEmail({ confirmUrl, unsubscribeUrl }: { confirmUrl: string; unsubscribeUrl: string }) {
  return (
    <EmailLayout preview="Confirm your Soul Good newsletter subscription" footer={<UnsubscribeFooter unsubscribeUrl={unsubscribeUrl} />}>
      <Text style={emailStyles.eyebrow}>One quick step</Text>
      <Text style={emailStyles.heading}>Confirm your subscription.</Text>
      <Text style={emailStyles.paragraph}>
        Tap below to start receiving the Soul Good newsletter: new menus, community meal drives, and news from
        our kitchen. If you didn’t ask for this, you can ignore this email and you won’t be subscribed.
      </Text>
      <Button href={confirmUrl} style={emailStyles.button}>
        Confirm my subscription
      </Button>
      <Text style={{ ...emailStyles.muted, marginTop: "22px" }}>This link expires in 7 days.</Text>
    </EmailLayout>
  );
}

export function NewsletterWelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <EmailLayout preview="You’re on the Soul Good newsletter" footer={<UnsubscribeFooter unsubscribeUrl={unsubscribeUrl} />}>
      <Text style={emailStyles.eyebrow}>Welcome to the table</Text>
      <Text style={emailStyles.heading}>You’re subscribed.</Text>
      <Text style={emailStyles.paragraph}>
        Thanks for joining. We’ll write when there’s something worth sharing: a new menu, a Food for the Soul
        meal drive, or a note from the kitchen. We won’t sell or share your email.
      </Text>
      <Button href="https://www.soulgood.kitchen/menu" style={emailStyles.button}>
        See the menu
      </Button>
    </EmailLayout>
  );
}
