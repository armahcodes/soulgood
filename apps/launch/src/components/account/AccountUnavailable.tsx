import { RefreshAccountButton } from "./RefreshAccountButton";
import { CancellationHelp } from "./CancellationHelp";

export function AccountUnavailable({ plans = false }: { plans?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="rounded-lg border border-forest/12 bg-card shadow-[0_20px_40px_-36px_rgb(44_58_52/0.45)] p-6 sm:p-8">
        <p className="text-xs font-medium tracking-[0.14em] text-clay uppercase">
          Temporarily unavailable
        </p>
        <h1 className="mt-4 text-4xl">
          We couldn’t load your {plans ? "weekly plans" : "orders"}.
        </h1>
        <p className="mt-4 text-sm leading-6 text-forest/75">
          This does not mean your{" "}
          {plans ? "plan has ended" : "orders are missing"}. No changes were
          made. Please try again, or contact us for help.
        </p>
        <RefreshAccountButton />
      </section>
      <CancellationHelp />
    </div>
  );
}
