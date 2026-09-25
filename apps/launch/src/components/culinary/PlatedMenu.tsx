"use client";

import { ChefHat, Leaf, Utensils } from "lucide-react";
import { PLATED_MENUS, type PlatedMenuId } from "@/lib/culinary-booking";

const ICONS = {
  "chefs-selection": ChefHat,
  "plant-forward": Leaf,
  chicken: Utensils,
};

export function PlatedMenu({
  value,
  guestCount,
  onChange,
}: {
  value: PlatedMenuId;
  guestCount: number;
  onChange: (menu: PlatedMenuId) => void;
}) {
  return (
    <>
      <h2
        id="menu-title"
        className="text-center font-serif text-3xl sm:text-left"
      >
        What’s on the table?
      </h2>
      <p className="mb-5 mt-3 text-center text-sm leading-6 text-forest/75 sm:text-left">
        One food style for your whole group. We’ll shape the dishes around your
        gathering.
      </p>
      <div
        role="radiogroup"
        aria-label="Food style for your group"
        className="grid gap-3"
      >
        {PLATED_MENUS.map((menu) => {
          const Icon = ICONS[menu.id];
          return (
            <label
              key={menu.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-clay sm:gap-4 sm:p-5 ${value === menu.id ? "border-forest bg-forest text-oat" : "border-forest/20 bg-white/40 hover:border-sage"}`}
            >
              <Icon size={22} className="mt-1 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-2xl">{menu.name}</span>
                <span
                  className={`mt-1 block text-sm leading-6 ${value === menu.id ? "text-oat/85" : "text-forest/75"}`}
                >
                  {menu.description}
                </span>
              </span>
              <input
                type="radio"
                name="platedMenu"
                value={menu.id}
                checked={value === menu.id}
                onChange={() => onChange(menu.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-sage"
              />
            </label>
          );
        })}
      </div>
      <p
        role="status"
        className="mt-4 text-center text-sm font-semibold sm:text-left"
      >
        One menu for {guestCount} {guestCount === 1 ? "guest" : "guests"} · $55
        per person
      </p>
      <p className="mt-2 text-center text-xs leading-6 text-forest/70 sm:text-left">
        Share allergies and dietary needs in the contact step. Final dishes and
        accommodations are confirmed by our team; these styles are not
        allergen-free guarantees.
      </p>
    </>
  );
}
