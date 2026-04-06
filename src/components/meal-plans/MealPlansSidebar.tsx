"use client";

interface SidebarLink {
  label: string;
  href: string;
  isActive: boolean;
}

interface MealPlansSidebarProps {
  links: SidebarLink[];
  activeLink: string;
  onLinkClick: (label: string) => void;
}

export function MealPlansSidebar({ links, activeLink, onLinkClick }: MealPlansSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-border">
      <nav
        className="sticky top-32 py-12 px-8"
        aria-label="Meal plans sidebar navigation"
      >
        <ul className="space-y-1">
          {links.map((link) => {
            const isCurrentlyActive = activeLink === link.label;
            const isAnchor = link.href.startsWith("#");

            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (isAnchor) {
                      e.preventDefault();
                      onLinkClick(link.label);
                    }
                  }}
                  className={`block label-text text-xs py-3 px-4 transition-all duration-300 ${
                    isCurrentlyActive
                      ? "bg-cream-dark text-black font-semibold"
                      : "text-black/60 hover:text-black hover:bg-cream"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
