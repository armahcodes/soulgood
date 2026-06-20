import { ClipboardList, Truck, Utensils } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose Your Plan",
    description:
      "Select between Performance Fuel or Full Alignment Fuel. Pick your day count (3 or 5 days) and delivery schedule.",
    step: "01",
  },
  {
    icon: Utensils,
    title: "We Prepare Your Meals",
    description:
      "Chef Kyla and the Soul Good kitchen craft your meals fresh each week using seasonal, nutrient-dense ingredients.",
    step: "02",
  },
  {
    icon: Truck,
    title: "Delivered to Your Door",
    description:
      "Meals arrive fresh to your doorstep Sunday evening or Monday morning. Just heat, enjoy, and nourish your soul.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-cream">
      <div className="text-center mb-12">
        <p className="label-text text-primary text-xs tracking-widest mb-4">
          SIMPLE & SEAMLESS
        </p>
        <h2 className="font-heading text-3xl md:text-4xl">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="text-center">
              {/* Step number */}
              <span className="label-text text-xs text-primary tracking-widest mb-4 block">
                STEP {step.step}
              </span>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-dark mb-6">
                <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-black/60 max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
