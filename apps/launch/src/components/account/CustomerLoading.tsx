import { Skeleton } from "@/components/ui/kit/skeleton";
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
      <div role="status" className="mx-auto grid max-w-3xl gap-5">
        <div>
          <p className="font-serif text-3xl text-forest">{label}</p>
          <p className="mt-3 text-sm leading-6 text-forest/75">
            Please wait a moment. No changes are being made to your orders or
            plans.
          </p>
        </div>
        {[0, 1].map((card) => (
          <div
            key={card}
            className="grid gap-4 rounded-lg border border-forest/12 bg-card p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="grid flex-1 gap-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-3/5" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="grid gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </CustomerShell>
  );
}
