import { MENU_COLLECTIONS, type MenuCollectionId } from "@soulgood/menu";

interface CollectionMenuProps {
  /** Which pathway/collection menu to render. */
  collection: MenuCollectionId;
  /** Optional eyebrow above the menu (defaults to a friendly label). */
  eyebrow?: string;
}

/**
 * Renders the full, real Soul Good menu for a single pathway collection, grouped
 * by category (Wraps / Bowls / Breakfast & Essentials / Juices & Hydration).
 * Pure presentational — safe to render inside client or server components.
 * Sourced entirely from `@soulgood/menu` (the single source of truth).
 */
export function CollectionMenu({
  collection,
  eyebrow = "On your menu",
}: CollectionMenuProps) {
  const def = MENU_COLLECTIONS[collection];
  return (
    <div className="flex w-full flex-col gap-4 text-left">
      <p className="text-xs font-bold tracking-[0.18em] text-forest/40 uppercase">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-3">
        {def.categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-2 rounded-2xl border border-sage/20 bg-oat/70 p-4"
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sage uppercase">
              {category.label}
            </p>
            <ul className="flex flex-col gap-1.5">
              {category.items.map((item) => (
                <li
                  key={`${item.name}-${item.note ?? ""}`}
                  className="text-[14px] leading-snug text-forest/80"
                >
                  {item.name}
                  {item.note ? (
                    <span className="text-forest/45"> · {item.note}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
