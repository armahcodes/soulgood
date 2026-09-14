import { Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./EmailLayout";
import { formatCents } from "@/lib/brand";
import type { CulinaryQuote, CulinaryRequest } from "@/lib/culinary-booking";
import { platedMenuName } from "@/lib/culinary-booking";

export function CulinaryQuoteEmail({
  quote,
  request,
  audience,
  invoiceId,
}: {
  quote: CulinaryQuote;
  request: CulinaryRequest;
  audience: "customer" | "team";
  invoiceId?: string;
}) {
  const address = quote.input.address;
  return (
    <EmailLayout
      preview={`Culinary booking request ${quote.reference} · ${formatCents(quote.totalCents)}`}
    >
      <Text style={emailStyles.eyebrow}>
        Culinary bookings · {quote.reference}
      </Text>
      <Text style={emailStyles.heading}>
        {audience === "team"
          ? "A gathering to plan."
          : "Your gathering starts here."}
      </Text>
      <Text style={emailStyles.paragraph}>
        {audience === "team"
          ? `${request.contact.name} submitted a culinary booking request.`
          : `Thank you, ${request.contact.name}. We received your booking request and will follow up to confirm availability, service timing, and event details.`}{" "}
        This estimate is not a confirmed reservation. No payment has been taken.
      </Text>
      <Section style={emailStyles.panel}>
        <Text style={emailStyles.label}>
          {quote.input.experience === "plated"
            ? "Plated culinary experience"
            : "Bowl delivery only"}
        </Text>
        <Text style={emailStyles.paragraph}>
          {quote.input.experience === "plated"
            ? `${quote.input.guestCount ?? quote.bowlCount} guests · ${quote.bowlCount} plated servings`
            : `${quote.bowlCount} bowls`}{" "}
          · {quote.input.eventDate} at {quote.input.eventTime} (Los Angeles
          time)
          <br />
          {quote.input.occasion || "Private gathering"}
          <br />
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          <br />
          {address.city}, CA {address.postalCode}
        </Text>
        {quote.items.map((item) => (
          <Text key={item.id} style={emailStyles.muted}>
            {item.label}
            {item.kind === "bowl" || item.kind === "plated"
              ? ` · ${item.quantity} × ${formatCents(item.unitCents)}`
              : ""}
            : {formatCents(item.amountCents)}
          </Text>
        ))}
        {quote.input.platedMenu && (
          <Text style={emailStyles.muted}>
            Food style for the group: {platedMenuName(quote.input.platedMenu)}.
            Our team will confirm the final dishes and dietary requests before
            booking.
          </Text>
        )}
        <Text style={{ ...emailStyles.muted, marginTop: "14px" }}>
          Subtotal: {formatCents(quote.subtotalCents)}
          <br />
          Estimated California tax ({quote.taxPercentage}%):{" "}
          {formatCents(quote.taxCents)}
        </Text>
        <Text style={emailStyles.total}>
          Estimated total: {formatCents(quote.totalCents)} USD
        </Text>
      </Section>
      {quote.paymentSchedule && (
        <Section style={emailStyles.panel}>
          <Text style={emailStyles.label}>Your payment schedule</Text>
          <Text style={emailStyles.paragraph}>
            50% deposit: {formatCents(quote.paymentSchedule.depositCents)},
            after availability approval and contract signature.
            <br />
            Remaining balance: {formatCents(quote.paymentSchedule.balanceCents)}
            , due {quote.paymentSchedule.balanceDueDate} before our team
            arrives.
          </Text>
          <Text style={emailStyles.muted}>
            We will confirm arrival time and send the reviewed Square invoice
            and contract. Your request alone does not reserve the date.
          </Text>
        </Section>
      )}
      {quote.input.experience === "plated" && (
        <Text style={{ ...emailStyles.paragraph, marginTop: "22px" }}>
          {quote.pricingVersion === 2
            ? "Plated service is $55 per guest, with a $555 food minimum plus a mandatory $500 culinary-support fee for plating, service, and ingredient education."
            : "The food minimum and required culinary support are itemized above. Support includes plating, service, and ingredient education."}{" "}
          Staffing and timing are confirmed before booking.
        </Text>
      )}
      {audience === "team" && (
        <Section style={emailStyles.panel}>
          <Text style={emailStyles.label}>
            {invoiceId
              ? "Square draft ready — action required"
              : "Booking review checklist"}
          </Text>
          <Text style={emailStyles.paragraph}>
            {invoiceId
              ? `Square invoice ID: ${invoiceId}. `
              : quote.pricingVersion === 2
                ? "Invoice draft creation is queued. A separate team email will confirm when it is ready. "
                : "This is a historical request. Review its original pricing and prepare the invoice manually. "}
            Review availability, headcount, menu, dietary requests, access,
            staffing, tax, and the arrival time. In Square, attach the approved
            native contract, require signature before payment, and review the
            deposit due date before sending the invoice.
          </Text>
          <Text style={emailStyles.muted}>
            The app does not create or sign native Square Contracts, publish
            invoices, charge a card, or reserve a date. Record the confirmed
            arrival time and the requirement to settle the balance before
            arrival in the contract.
          </Text>
        </Section>
      )}
      <Text style={{ ...emailStyles.paragraph, marginTop: "22px" }}>
        Contact: {request.contact.name}
        <br />
        {request.contact.email}
        <br />
        {request.contact.phone}
        {request.company ? (
          <>
            <br />
            {request.company}
          </>
        ) : null}
      </Text>
      {request.notes && (
        <>
          <Text style={emailStyles.label}>Event notes & dietary requests</Text>
          <Text style={emailStyles.paragraph}>{request.notes}</Text>
        </>
      )}
      <Text style={emailStyles.muted}>
        Prices are in USD. Tax is an estimate based on the current address rate;
        final tax and availability are confirmed before payment. Please reply
        with any changes to your request. Dietary requests require confirmation
        by our team.
      </Text>
    </EmailLayout>
  );
}
