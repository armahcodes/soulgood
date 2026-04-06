"use client";

import { useState } from "react";
import { MealPlansSidebar } from "./MealPlansSidebar";
import { MealPlansHeroBanner } from "./MealPlansHeroBanner";
import { PlanComparisonCards } from "./PlanComparisonCards";
import { HowItWorks } from "./HowItWorks";
import { DeliveryAreaInfo } from "./DeliveryAreaInfo";
import { MealPlansCTA } from "./MealPlansCTA";

const SIDEBAR_LINKS = [
  { label: "COMPARE PLANS", href: "#compare", isActive: true },
  { label: "PERFORMANCE FUEL", href: "/meal-plans/performance-fuel", isActive: false },
  { label: "FULL ALIGNMENT FUEL", href: "/meal-plans/full-alignment", isActive: false },
  { label: "WEEKLY MENU", href: "/menu", isActive: false },
  { label: "BLOG", href: "/blog", isActive: false },
];

export function MealPlansContent() {
  const [activeSidebarLink, setActiveSidebarLink] = useState("COMPARE PLANS");

  return (
    <div className="max-container">
      {/* Mobile: Top nav bar (visible below lg) */}
      <div className="lg:hidden border-b border-border overflow-x-auto">
        <nav className="flex whitespace-nowrap" aria-label="Meal plans navigation">
          {SIDEBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith("#")) {
                  e.preventDefault();
                  setActiveSidebarLink(link.label);
                }
              }}
              className={`label-text text-xs px-5 py-4 border-b-2 transition-colors duration-300 ${
                activeSidebarLink === link.label
                  ? "border-black text-black"
                  : "border-transparent text-black/50 hover:text-black"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Desktop: Left sidebar (hidden below lg) */}
        <MealPlansSidebar
          links={SIDEBAR_LINKS}
          activeLink={activeSidebarLink}
          onLinkClick={setActiveSidebarLink}
        />

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Hero Promo Banner */}
          <MealPlansHeroBanner />

          {/* Side-by-side Comparison Cards */}
          <section id="compare" className="section-padding">
            <div className="text-center mb-12">
              <p className="label-text text-primary text-xs tracking-widest mb-4">
                FIND YOUR PLAN
              </p>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4">
                Compare Meal Plans
              </h1>
              <p className="font-body text-base md:text-lg text-black/60 max-w-2xl mx-auto">
                Two tiers of chef-crafted, nutrient-dense meals designed to fuel your
                body and nourish your soul. Choose the plan that aligns with your
                wellness goals.
              </p>
            </div>
            <PlanComparisonCards />
          </section>

          {/* How It Works */}
          <HowItWorks />

          {/* Delivery Area Info */}
          <DeliveryAreaInfo />

          {/* CTA Section */}
          <MealPlansCTA />
        </div>
      </div>
    </div>
  );
}
