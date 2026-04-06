import { MapPin, Calendar, Clock } from "lucide-react";
import { DELIVERY_AREAS } from "@/lib/constants";

export function DeliveryAreaInfo() {
  return (
    <section id="delivery" className="section-padding">
      <div className="text-center mb-12">
        <p className="label-text text-primary text-xs tracking-widest mb-4">
          LA DELIVERY
        </p>
        <h2 className="font-heading text-3xl md:text-4xl mb-4">
          We Deliver Across Greater Los Angeles
        </h2>
        <p className="font-body text-base text-black/60 max-w-xl mx-auto">
          From Long Beach to Malibu, the Valley to Downtown LA — Soul Good brings
          chef-crafted meals to your neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
        {/* Neighborhoods */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-cream-dark">
              <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="label-text text-sm">NEIGHBORHOODS WE SERVE</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {DELIVERY_AREAS.map((area) => (
              <span
                key={area}
                className="font-body text-sm text-black/70 py-1"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Delivery Schedule */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-cream-dark">
              <Calendar className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="label-text text-sm">DELIVERY SCHEDULE</h3>
          </div>

          <div className="space-y-4">
            <div className="border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="label-text text-xs">OPTION 1</span>
              </div>
              <p className="font-body text-sm text-black/80 font-medium">
                Sunday Evening Delivery
              </p>
              <p className="font-body text-xs text-black/50 mt-1">
                Meals arrive between 5pm – 9pm Sunday
              </p>
            </div>

            <div className="border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="label-text text-xs">OPTION 2</span>
              </div>
              <p className="font-body text-sm text-black/80 font-medium">
                Monday Morning Delivery
              </p>
              <p className="font-body text-xs text-black/50 mt-1">
                Meals arrive between 6am – 10am Monday
              </p>
            </div>

            <div className="border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="label-text text-xs">OPTION 3</span>
              </div>
              <p className="font-body text-sm text-black/80 font-medium">
                Twice Weekly
              </p>
              <p className="font-body text-xs text-black/50 mt-1">
                Split delivery — available in select areas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
