import { ChefHat, Leaf, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  className?: string;
}

const TRUST_BADGES = [
  {
    icon: ChefHat,
    label: "Chef Crafted",
    description: "Handmade by Chef Kyla",
  },
  {
    icon: Leaf,
    label: "Nutrient Dense",
    description: "Packed with whole-food nutrition",
  },
  {
    icon: MapPin,
    label: "Locally Sourced",
    description: "LA-area farms & suppliers",
  },
];

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-6 py-8 border-t border-border",
        className
      )}
    >
      {TRUST_BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center text-center"
        >
          <badge.icon className="w-7 h-7 text-primary mb-3" strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-[0.06em] font-semibold mb-1">
            {badge.label}
          </span>
          <span className="font-body text-xs text-black/50 hidden sm:block">
            {badge.description}
          </span>
        </div>
      ))}
    </div>
  );
}
