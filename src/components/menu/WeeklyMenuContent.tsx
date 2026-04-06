"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { WEEKLY_MENU } from "@/lib/constants";
import type { MenuItem } from "@/lib/types";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  juice: "Breakfast Juice",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MEAL_TYPE_ORDER = ["juice", "lunch", "dinner", "snack"];

function getMealsByDay(day: string): MenuItem[] {
  const dayMeals = WEEKLY_MENU.filter((item) => item.dayOfWeek === day);
  return dayMeals.sort(
    (a, b) =>
      MEAL_TYPE_ORDER.indexOf(a.mealType) -
      MEAL_TYPE_ORDER.indexOf(b.mealType)
  );
}

function MealCard({ meal }: { meal: MenuItem }) {
  return (
    <div className="group">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-light mb-4">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
          data-placeholder="true"
        />
      </div>
      <p className="label-text text-xs text-primary mb-2">
        {MEAL_TYPE_LABELS[meal.mealType] || meal.mealType}
      </p>
      <h3 className="font-heading text-lg md:text-xl mb-2">{meal.name}</h3>
      <p className="font-body text-sm text-black/60 leading-relaxed">
        {meal.description}
      </p>
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
            THIS WEEK&apos;S MENU
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            What&apos;s Cooking
          </h1>
          <p className="font-body text-base md:text-lg text-black/60 max-w-2xl mx-auto mb-8">
            Explore this week&apos;s chef-crafted meals — made with intention,
            seasoned with love, and delivered fresh to your door. Menus rotate
            weekly with seasonal ingredients.
          </p>
          <p className="label-text text-xs text-black/40 tracking-widest">
            PERFORMANCE FUEL: JUICE + LUNCH + DINNER &nbsp;|&nbsp; FULL
            ALIGNMENT: JUICE + LUNCH + DINNER + SNACK
          </p>
        </div>
      </section>

      {/* Day-by-Day Menu */}
      <section className="section-padding">
        <div className="max-container">
          {DAYS_OF_WEEK.map((day, index) => {
            const meals = getMealsByDay(day);
            return (
              <div
                key={day}
                className={index < DAYS_OF_WEEK.length - 1 ? "mb-16 md:mb-20" : ""}
              >
                {/* Day Header */}
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-heading text-2xl md:text-3xl">
                    {DAY_LABELS[day]}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Meal Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* View Next Week Link */}
      <section className="pb-8 md:pb-12">
        <div className="max-container px-6 md:px-16 text-center">
          <button
            type="button"
            className="label-text text-sm text-primary hover:text-primary-dark transition-colors duration-300 cursor-pointer"
            onClick={() => {
              // TODO: Backend Integration - Navigate to next week's menu
              alert("Next week's menu coming soon!");
            }}
          >
            VIEW NEXT WEEK →
          </button>
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
