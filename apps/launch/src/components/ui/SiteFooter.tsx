import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { CONTACT } from "@/lib/brand";
import { EAT_NOW } from "@/lib/ordering";

const LEGAL_LINKS = [
  { href: EAT_NOW.infoPath, label: "About Eat Now" },
  { href: "/account", label: "My orders" },
  { href: "/quote", label: "Culinary bookings" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/customer-agreement", label: "Customer Agreement" },
  { href: "/cancel", label: "Manage or cancel a plan" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-oat/12 bg-forest text-oat">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <Wordmark href="/" variant="cream" />
          <p className="max-w-sm text-sm leading-relaxed text-oat/55">
            Thoughtfully prepared in Los Angeles. From our kitchen to your table,
            with care from the Soul Good team. Weekly nourishment is available
            on Sundays; Eat Now times are shown in the menu.
          </p>
        </div>

        <nav aria-label="Legal and support" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-oat/80 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center md:justify-end">
          <a href={EAT_NOW.menuUrl} className="transition-colors hover:text-gold">Eat Now menu</a>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-gold">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-gold">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
