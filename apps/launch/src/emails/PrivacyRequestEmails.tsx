import { Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";
import { PRIVACY_REQUEST_TYPES } from "@/lib/privacy-shared";
import type { PrivacyRequestRecord } from "@/lib/privacy-requests";

const label = (value: string) => PRIVACY_REQUEST_TYPES.find((item) => item.value === value)?.label ?? value;
const row = { ...emailStyles.muted, margin: "0 0 6px" };

export function PrivacyTeamEmail({ request: r }: { request: PrivacyRequestRecord }) {
  return (
    <EmailLayout preview={`Privacy request ${r.reference} · respond by ${r.respondBy}`}>
      <Text style={emailStyles.eyebrow}>Privacy request · {r.reference}</Text>
      <Text style={emailStyles.heading}>{label(r.requestType)}</Text>
      <Section style={emailStyles.panel}>
        <Text style={row}>From: {r.name} · {r.email}</Text>
        <Text style={row}>Relationship: {r.relationship === "agent" ? `Authorized agent for ${r.agentFor}` : "The consumer"}</Text>
        <Text style={row}>Received {r.receivedAt.slice(0, 10)} · respond by {r.respondBy}</Text>
        {r.details ? <Text style={row}>Details: {r.details}</Text> : null}
      </Section>
      <Text style={{ ...emailStyles.paragraph, marginTop: "18px" }}>
        Verify the requester by replying from contact@soulgood.com before disclosing or deleting anything. Search leads,
        checkout records, culinary quotes, community interests, meal drive applications, newsletter subscribers, and
        Square. Marketing opt-outs from the consumer were applied automatically. Keep this record for 24 months.
      </Text>
    </EmailLayout>
  );
}

export function PrivacyAckEmail({ name, reference, requestType, respondBy }: { name: string; reference: string; requestType: string; respondBy: string }) {
  return (
    <EmailLayout preview={`We received your privacy request · ${reference}`}>
      <Text style={emailStyles.eyebrow}>Privacy request · {reference}</Text>
      <Text style={emailStyles.heading}>We received your request.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {name}, we received your request: “{label(requestType)}.”{" "}
        {requestType === "marketing"
          ? "You’ve been removed from marketing emails. Order and account emails you request will still arrive."
          : `To protect your information, we’ll first confirm it’s you by email, then respond by ${respondBy}. We’ll never ask for your password or full payment details.`}
      </Text>
      <Text style={emailStyles.muted}>If you didn’t make this request, reply to let us know.</Text>
    </EmailLayout>
  );
}
