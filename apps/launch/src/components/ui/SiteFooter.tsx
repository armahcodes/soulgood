import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { CONTACT } from "@/lib/brand";

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/customer-agreement", label: "Customer Agreement" },
  { href: "/cancel", label: "Cancel subscription" },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest text-oat">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12">
        <div className="flex flex-col items-start gap-4">
          <Wordmark href="/" className="text-oat" />
          <p className="max-w-sm text-sm leading-relaxed text-oat/55">
            Chef-made in Los Angeles County. Sunday pickup or delivery by Soul Goods LLC.
          </p>
        </div>

        <nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-oat/68 md:justify-end">
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
