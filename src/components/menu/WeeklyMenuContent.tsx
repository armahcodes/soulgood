import { Button } from "@/components/ui/Button";
import {
  MENU_BRAND,
  MENU_COLLECTION_LIST,
  type MenuCategory,
  type MenuCollection,
} from "@/lib/menu";

function CategoryBlock({ category }: { category: MenuCategory }) {
  return (
    <div>
      <h4 className="label-text text-xs text-primary tracking-widest mb-4">
        {category.label}
      </h4>
      <ul className="space-y-3">
        {category.items.map((item) => (
          <li key={item.name} className="font-body text-base leading-relaxed">
            <span>{item.name}</span>
            {item.note ? (
              <span className="block text-sm text-black/50">{item.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollectionBlock({ collection }: { collection: MenuCollection }) {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-2xl md:text-3xl">{collection.name}</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="font-body text-base text-black/60">
          <span className="font-medium text-black/80">{collection.tagline}.</span>{" "}
          {collection.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {collection.categories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export function WeeklyMenuContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-cream text-center">
        <div className="max-container">
          <p className="label-text text-xs text-primary tracking-widest mb-4">
            THE MENU
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            {MENU_BRAND.headline}
          </h1>
          <p className="font-body text-base md:text-lg text-black/60 max-w-2xl mx-auto">
            {MENU_BRAND.subhead} Every collection offers the same four
            categories — Wraps, Bowls, Breakfast &amp; Essentials, and Juices
            &amp; Hydration — crafted with intention by Chef Kyla.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="section-padding">
        <div className="max-container space-y-16 md:space-y-24">
          {MENU_COLLECTION_LIST.map((collection) => (
            <CollectionBlock key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-black text-white text-center">
        <div className="max-container">
          <p className="label-text text-xs text-primary tracking-widest mb-4">
            NOURISH YOUR SOUL
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            Ready to Eat This Good?
          </h2>
          <p className="font-body text-base text-white/60 max-w-lg mx-auto mb-8">
            Choose your plan, pick your days, and let Chef Kyla&apos;s kitchen
            handle the rest. Fresh, intentional meals delivered weekly.
          </p>
          <Button
            as="a"
            href="/meal-plans/order"
            variant="secondary"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            START YOUR ORDER
          </Button>
        </div>
      </section>
    </>
  );
}
