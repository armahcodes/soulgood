import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

const colors = {
  clay: "#C17A5E",
  forest: "#2C3A34",
  gold: "#C9A161",
  oat: "#F8F3EC",
  sage: "#77916F",
  sand: "#ECD6BC",
} as const;

export function EmailLayout({
  children,
  preview,
}: {
  children: ReactNode;
  preview: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={brandBarStyle}>
            <Text style={wordmarkStyle}>SOUL GOOD</Text>
            <Text style={brandLineStyle}>NOURISH · HEAL · THRIVE</Text>
          </Section>
          <Section style={contentStyle}>{children}</Section>
          <Hr style={dividerStyle} />
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Soul Bowls™ by Soul Goods LLC · Los Angeles County, California
            </Text>
            <Text style={footerTextStyle}>
              <Link href="https://www.soulgood.kitchen/account" style={footerLinkStyle}>
                My orders
              </Link>
              {" · "}
              <Link href="https://www.soulgood.kitchen/customer-agreement" style={footerLinkStyle}>
                Customer Agreement
              </Link>
              {" · "}
              <Link href="mailto:contact@soulgood.com" style={footerLinkStyle}>
                Contact
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  button: {
    backgroundColor: colors.forest,
    color: colors.oat,
    display: "inline-block",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    padding: "15px 24px",
    textDecoration: "none",
    textTransform: "uppercase" as const,
  },
  eyebrow: {
    color: colors.clay,
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 18px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: colors.forest,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "42px",
    fontWeight: "400",
    letterSpacing: "-1px",
    lineHeight: "1.05",
    margin: "0 0 22px",
  },
  label: {
    color: colors.forest,
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.6px",
    margin: "0 0 5px",
    textTransform: "uppercase" as const,
  },
  muted: {
    color: "#65716C",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0",
  },
  panel: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${colors.sand}`,
    padding: "22px",
  },
  paragraph: {
    color: "#46534E",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "16px",
    lineHeight: "1.65",
    margin: "0 0 22px",
  },
  total: {
    color: colors.forest,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "30px",
    margin: "4px 0 0",
  },
};

const bodyStyle = {
  backgroundColor: colors.oat,
  margin: "0",
  padding: "28px 12px",
};

const containerStyle = {
  backgroundColor: colors.oat,
  border: `1px solid ${colors.sand}`,
  margin: "0 auto",
  maxWidth: "620px",
};

const brandBarStyle = {
  backgroundColor: colors.forest,
  padding: "28px 34px 24px",
};

const wordmarkStyle = {
  color: colors.oat,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "27px",
  letterSpacing: "3px",
  margin: "0",
};

const brandLineStyle = {
  color: colors.gold,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "9px",
  letterSpacing: "2px",
  margin: "7px 0 0",
};

const contentStyle = { padding: "42px 34px 34px" };
const dividerStyle = { borderColor: colors.sand, margin: "0" };
const footerStyle = { padding: "24px 34px 30px" };
const footerTextStyle = {
  color: "#77827E",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "11px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};
const footerLinkStyle = { color: colors.clay, textDecoration: "underline" };
