import { Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";
import {
  HOST_COMMITMENTS,
  labelFor,
  NEED_INDICATORS,
  ORGANIZATION_TYPES,
  REVIEW_CRITERIA,
  SITE_FEATURES,
  SITE_SETTINGS,
  TIME_WINDOWS,
} from "@/lib/meal-drive";
import type { MealDriveApplicationRecord } from "@/lib/meal-drive-application";

const row = { ...emailStyles.muted, margin: "0 0 6px" };

export function MealDriveTeamEmail({ application: a }: { application: MealDriveApplicationRecord }) {
  return (
    <EmailLayout preview={`Host application ${a.reference} · ${a.organizationName}`}>
      <Text style={emailStyles.eyebrow}>Food for the Soul · Host application</Text>
      <Text style={emailStyles.heading}>{a.organizationName}</Text>
      <Text style={emailStyles.paragraph}>
        {a.reference} · received {new Date(a.receivedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}. Review complete
        applications in the order received, using only the published criteria.
      </Text>
      <Section style={emailStyles.panel}>
        <Text style={emailStyles.label}>Readiness checklist</Text>
        {a.checklist.map((item) => (
          <Text key={item.id} style={row}>
            {item.met ? "✓" : "○"} {REVIEW_CRITERIA.find((c) => c.id === item.id)?.title}: {item.note}
          </Text>
        ))}
        <Text style={{ ...emailStyles.label, marginTop: "16px" }}>Organization</Text>
        <Text style={row}>{labelFor(ORGANIZATION_TYPES, a.organizationType)}{a.organizationWebsite ? ` · ${a.organizationWebsite}` : ""}</Text>
        <Text style={row}>{a.contactName} ({a.contactRole}) · {a.email} · {a.phone}</Text>
        <Text style={{ ...emailStyles.label, marginTop: "16px" }}>Community</Text>
        <Text style={row}>{a.communityArea} · about {a.households} households</Text>
        {a.needs.map((need) => (
          <Text key={need} style={row}>• {labelFor(NEED_INDICATORS, need)}</Text>
        ))}
        {a.needDetails ? <Text style={row}>{a.needDetails}</Text> : null}
        <Text style={{ ...emailStyles.label, marginTop: "16px" }}>Site and date</Text>
        <Text style={row}>
          {a.siteName ? `${a.siteName}, ` : ""}{a.addressLine1}, {a.city}, CA {a.postalCode} ({a.county} County) · {labelFor(SITE_SETTINGS, a.setting)}
        </Text>
        <Text style={row}>Permission: {a.sitePermission === "confirmed" ? "confirmed" : "in progress"}</Text>
        {a.features.map((feature) => (
          <Text key={feature} style={row}>• {labelFor(SITE_FEATURES, feature)}</Text>
        ))}
        <Text style={row}>
          Preferred {a.preferredDate}{a.alternateDate ? ` · alternate ${a.alternateDate}` : ""} · {labelFor(TIME_WINDOWS, a.timeWindow)} · {a.volunteers} volunteers
        </Text>
        {a.notes ? (
          <>
            <Text style={{ ...emailStyles.label, marginTop: "16px" }}>Notes</Text>
            <Text style={row}>{a.notes}</Text>
          </>
        ) : null}
      </Section>
    </EmailLayout>
  );
}

export function MealDriveApplicantEmail({
  contactName,
  organizationName,
  reference,
  preferredDate,
}: {
  contactName: string;
  organizationName: string;
  reference: string;
  preferredDate: string;
}) {
  return (
    <EmailLayout preview={`We received your Food for the Soul host application · ${reference}`}>
      <Text style={emailStyles.eyebrow}>Food for the Soul · {reference}</Text>
      <Text style={emailStyles.heading}>Thank you for applying.</Text>
      <Text style={emailStyles.paragraph}>
        Hi {contactName}, we received the application from {organizationName} to host a meal drive, with a preferred
        date of {preferredDate}. We review complete applications in the order we receive them and will reply by email
        about fit, timing, and next steps. This isn’t a confirmed drive yet.
      </Text>
      <Section style={emailStyles.panel}>
        <Text style={emailStyles.label}>What every drive commits to</Text>
        {HOST_COMMITMENTS.map((item) => (
          <Text key={item.key} style={row}>• {item.label}</Text>
        ))}
      </Section>
      <Text style={{ ...emailStyles.muted, marginTop: "18px" }}>
        Questions or changes? Reply to this email and include {reference}.
      </Text>
    </EmailLayout>
  );
}
