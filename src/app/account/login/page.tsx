import type { Metadata } from "next";
import { AccountLoginContent } from "@/components/account/AccountLoginContent";

export const metadata: Metadata = {
  title: "Account | Soul Good",
  description:
    "Sign in or create your Soul Good account. Manage your meal plans, orders, and subscriptions.",
  openGraph: {
    title: "Account | Soul Good",
    description:
      "Sign in or create your Soul Good account. Manage your meal plans, orders, and subscriptions.",
  },
};

export default function AccountLoginPage() {
  return (
    <main className="flex-1">
      <AccountLoginContent />
    </main>
  );
}
