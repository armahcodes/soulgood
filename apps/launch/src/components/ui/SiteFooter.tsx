import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { BUSINESS, CONTACT, TAGLINE } from "@/lib/brand";
import { EAT_NOW } from "@/lib/ordering";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Order",
    links: [
      { href: "/checkout", label: "Weekly nourishment" },
      { href: EAT_NOW.menuUrl, label: "Take Out menu", external: true },
      { href: EAT_NOW.infoPath, label: "About Take Out" },
      { href: "/quote", label: "Culinary bookings" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/food-for-the-soul", label: "Food for the Soul" },
      { href: `mailto:${CONTACT.email}`, label: "Contact", external: true },
    ],
  },
  {
    title: "Your account",
    links: [
      { href: "/account", label: "My orders" },
      { href: "/cancel", label: "Manage or cancel a plan" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/customer-agreement", label: "Customer Agreement" },
    ],
  },
];

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-oat/78 transition-colors hover:text-gold sm:min-h-9";

export function SiteFooter() {
  return (
    <footer className="site-footer relative overflow-hidden bg-forest text-oat">
      <Image
        src="/botanicals/clay-branch.png"
        alt=""
        width={320}
        height={400}
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-24 w-64 rotate-12 opacity-[0.12] sm:w-80"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-14 pb-8 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Wordmark href="/" variant="cream" />
            <p className="max-w-sm text-sm leading-relaxed text-oat/62">
              Thoughtfully prepared in Los Angeles. From our kitchen to your table,
              with care from the Soul Good team. Weekly nourishment is available
              on Sundays; Take Out times are shown in the menu.
            </p>
          </div>

          <nav
            aria-label="Legal and support"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-[0.65rem] font-medium tracking-[0.2em] text-gold uppercase">
                  {column.title}
                </p>
                <ul className="grid">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-oat/12 pt-6 text-xs text-oat/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BUSINESS.legalName} · {BUSINESS.serviceArea}
          </p>
          <p className="tracking-[0.2em] uppercase">{TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
