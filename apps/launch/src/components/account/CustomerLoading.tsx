import { CustomerShell } from "./CustomerShell";

export function CustomerLoading({
  active,
}: {
  active: "orders" | "plans" | "signin";
}) {
  const label =
    active === "plans"
      ? "Loading your weekly plans…"
      : active === "orders"
        ? "Loading your orders…"
        : "Opening secure sign-in…";
  return (
    <CustomerShell active={active}>
      <div
        role="status"
        className="mx-auto max-w-2xl border border-forest/15 bg-white/50 p-6 sm:p-8"
      >
        <h1 className="text-3xl">{label}</h1>
        <p className="mt-3 text-sm leading-6 text-forest/75">
          Please wait a moment. No changes are being made to your orders or
          plans.
        </p>
      </div>
    </CustomerShell>
  );
}
