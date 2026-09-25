import type { Ingredient } from "@/lib/food-groups";
import { cn } from "@/lib/utils";

const GROUPS = [
  { id: "vegetables", label: "Vegetables", tone: "border-sage/30 bg-sage/10" },
  { id: "grains", label: "Grains", tone: "border-forest/12 bg-oat" },
  { id: "protein", label: "Protein foods", tone: "border-clay/25 bg-clay/8" },
] as const;

/**
 * A dish's ingredients grouped by USDA MyPlate food group — descriptive only,
 * with no amounts or health claims.
 */
export function FoodGroupList({ items, className }: { items: Ingredient[]; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {GROUPS.map((group) => {
        const names = [...new Set(items.filter((item) => item.group === group.id).map((item) => (item.group === "grains" && item.whole ? `${item.name} · whole grain` : item.name)))];
        if (!names.length) return null;
        return (
          <div key={group.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
            <span className="w-24 shrink-0 text-xs text-forest/60">{group.label}</span>
            <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {names.map((name) => (
                <li key={name} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium text-forest/85", group.tone)}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
