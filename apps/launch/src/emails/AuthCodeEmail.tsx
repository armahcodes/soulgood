import { Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";

export function AuthCodeEmail({ code }: { code: string }) {
  return (
    <EmailLayout preview={`${code} is your Soul Bowls sign-in code`}>
      <Text style={emailStyles.eyebrow}>Secure customer access</Text>
      <Text style={emailStyles.heading}>Your sign-in code.</Text>
      <Text style={emailStyles.paragraph}>
        Enter this one-time code to see your Soul Bowls™ orders and weekly plan.
      </Text>
      <Section style={codePanelStyle}>
        <Text style={codeStyle}>{code}</Text>
      </Section>
      <Text style={{ ...emailStyles.muted, marginTop: "20px" }}>
        This code expires in 10 minutes and can only be used three times. If you
        did not request it, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

const codePanelStyle = {
  backgroundColor: "#ECD6BC",
  border: "1px solid #C9A161",
  padding: "25px 18px",
  textAlign: "center" as const,
};

const codeStyle = {
  color: "#2C3A34",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "34px",
  fontWeight: "700",
  letterSpacing: "10px",
  margin: "0",
};
