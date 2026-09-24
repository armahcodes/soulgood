import { Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";
import {
  COMMUNITY_DRIVE,
  COMMUNITY_INTERESTS,
  type CommunityInterestRecord,
} from "@/lib/community-drive";

export function CommunityInterestEmail({
  interest,
}: {
  interest: CommunityInterestRecord;
}) {
  return (
    <EmailLayout preview="A new connection for Food for the Soul.">
      <Text style={emailStyles.eyebrow}>Food for the Soul · Community</Text>
      <Text style={emailStyles.heading}>A little good starts here.</Text>
      <Text style={emailStyles.paragraph}>
        Someone wants to be part of Food for the Soul. Reply to this email to
        connect with them.
      </Text>
      {[
        ["Name", interest.name],
        ["Email", interest.email],
        [
          "Interested in",
          COMMUNITY_INTERESTS.find(
            (option) => option.value === interest.interest,
          )?.label,
        ],
        ["Community / city", interest.community || "Not provided"],
        ["Organization", interest.organization || "Not provided"],
        ["Message", interest.message || "No message added"],
      ].map(([label, value]) => (
        <div key={label}>
          <Text style={emailStyles.label}>{label}</Text>
          <Text
            style={{
              ...emailStyles.paragraph,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Text>
        </div>
      ))}
      <Text style={emailStyles.muted}>
        Campaign: {COMMUNITY_DRIVE.date}. This is an inquiry, not a confirmed
        drive or volunteer placement. They agreed to contact about Food for the
        Soul only; no meal-plan or marketing subscription was created.
      </Text>
    </EmailLayout>
  );
}
