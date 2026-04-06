"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { EVENTS, TESTIMONIALS } from "@/lib/constants";

/* ============================================
   Past Events Gallery Data
   ============================================ */
const PAST_EVENT_PHOTOS = [
  {
    id: "past-1",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    alt: "Tastemakers: Heritage Table — intimate dinner setting in a Downtown LA loft",
    caption: "Heritage Table — DTLA, February 2025",
  },
  {
    id: "past-2",
    src: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=600&h=400&fit=crop",
    alt: "Guests enjoying a plated course at a Soul Good pop-up dinner",
    caption: "Plated Course — Malibu, December 2024",
  },
  {
    id: "past-3",
    src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop",
    alt: "Chef Kyla presenting a dish at the Tastemakers dinner series",
    caption: "Chef Kyla in Action — Venice, November 2024",
  },
  {
    id: "past-4",
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop",
    alt: "Craft cocktails paired with a multi-course Soul Good dinner",
    caption: "Cocktail Pairings — Silver Lake, October 2024",
  },
  {
    id: "past-5",
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
    alt: "Vibrant plated dessert at a Soul Good event",
    caption: "Dessert Course — Beverly Hills, September 2024",
  },
  {
    id: "past-6",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    alt: "Candlelit communal table at a Tastemakers pop-up dinner",
    caption: "Communal Table — Santa Monica, August 2024",
  },
];

/* ============================================
   Section 1: Hero
   ============================================ */
function ExperiencesHero() {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&h=1000&fit=crop"
        alt="An elegant pop-up dinner experience by Soul Good — candlelit table with beautifully plated dishes"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        data-placeholder="true"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            DINE · CONNECT · EXPERIENCE
          </p>
          <h1 className="font-heading text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6">
            Soul Good Experiences
          </h1>
          <p className="font-body text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Intimate pop-up dinners, private chef events, and culinary
            experiences that nourish the body and feed the soul.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 2: Pop-Up Dinners (Tastemakers Series)
   ============================================ */
function PopUpDinners() {
  const upcomingEvents = EVENTS.filter((e) => !e.isPast);

  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        {/* Section Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            THE TASTEMAKERS SERIES
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6">
            Pop-Up Dinners by Chef Kyla
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed">
            Tastemakers is Soul Good&apos;s signature pop-up dinner series —
            intimate, multi-course evenings for 40–50 guests that blend Southern
            soul food traditions with global culinary influences. Each dinner is
            a one-night-only experience featuring seasonal menus, natural wine
            pairings, live music, and the kind of connection that only happens
            when people gather around a communal table. Tickets range from
            $120–$200 per person.
          </p>
        </div>

        {/* Upcoming Event Cards */}
        {upcomingEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border border-border bg-white"
              >
                {/* Event Image */}
                <div className="relative w-full aspect-[16/10]">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-placeholder="true"
                  />
                </div>

                {/* Event Details */}
                <div className="p-6 md:p-8">
                  {/* Date Badge */}
                  <p className="label-text text-primary text-xs tracking-widest mb-3">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {event.time}
                  </p>

                  {/* Name */}
                  <h3 className="font-heading text-xl md:text-2xl leading-tight mb-3">
                    {event.name}
                  </h3>

                  {/* Venue */}
                  <p className="font-sans text-xs uppercase tracking-[0.06em] text-black/50 mb-4">
                    {event.venue}
                  </p>

                  {/* Description */}
                  <p className="font-body text-sm md:text-base text-black/70 leading-relaxed mb-6">
                    {event.description}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold">
                      ${event.price} / person
                    </span>
                    <Button
                      as="a"
                      href={event.ticketUrl}
                      variant="primary"
                      size="sm"
                    >
                      GET TICKETS
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================
   Section 3: Past Events Gallery
   ============================================ */
function PastEventsGallery() {
  return (
    <section className="bg-cream-dark">
      <div className="max-container section-padding">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            PAST EVENTS
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6">
            Moments from the Table
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto">
            A look back at the dinners, gatherings, and culinary moments that
            have brought our community together.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {PAST_EVENT_PHOTOS.map((photo) => (
            <div key={photo.id} className="group">
              <div className="relative w-full aspect-[3/2] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-placeholder="true"
                />
              </div>
              <p className="mt-3 font-sans text-xs uppercase tracking-[0.06em] text-black/50">
                {photo.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 4: Catering CTA
   ============================================ */
function CateringCTA() {
  return (
    <section className="bg-black text-white">
      <div className="max-container">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&h=700&fit=crop"
              alt="Chef Kyla plating a beautifully crafted dish for a private event"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-placeholder="true"
            />
          </div>

          {/* Content Side */}
          <div className="flex items-center p-10 md:p-16 lg:p-20">
            <div>
              <p className="label-text text-primary mb-5 text-xs tracking-widest">
                PRIVATE CHEF & CATERING
              </p>
              <h2 className="font-heading text-3xl md:text-4xl leading-[1.12] mb-6">
                Bring Soul Good to Your Table
              </h2>
              <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-4">
                From intimate dinner parties to large-scale celebrations, Chef
                Kyla and the Soul Good team bring the full experience to you.
                Private chef services, custom menus, and full-service catering —
                every event is crafted with the same intention and care as our
                meal plans.
              </p>
              <p className="font-body text-base text-white/70 leading-relaxed mb-8">
                Whether it&apos;s a sit-down dinner for 12, a tray-passed
                reception for 200, or a corporate wellness luncheon, we create
                menus that reflect your vision and nourish your guests.
              </p>
              {/* TODO: Backend Integration - Link to catering inquiry form */}
              <Button
                as="a"
                href="/catering"
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                INQUIRE NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 5: Event Testimonials
   ============================================ */
function EventTestimonials() {
  const eventTestimonials = TESTIMONIALS.filter(
    (t) => t.category === "events" || t.category === "catering"
  );

  return (
    <section className="bg-cream">
      <div className="max-container section-padding">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            WHAT GUESTS ARE SAYING
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12]">
            Words from the Table
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {eventTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 md:p-10 border border-border"
            >
              {/* Star rating */}
              <div className="mb-5">
                <Rating value={testimonial.rating} size="sm" />
              </div>

              {/* Quote text */}
              <blockquote className="mb-6">
                <p className="font-body text-base italic text-black/70 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </blockquote>

              {/* Customer name + category */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <p className="font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/80">
                  {testimonial.name}
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-primary">
                  {testimonial.category === "events"
                    ? "Pop-Up Dinner"
                    : "Private Event"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Main Experiences Content Component
   ============================================ */
export function ExperiencesContent() {
  return (
    <>
      {/* 1. Hero — lifestyle event photo with overlay */}
      <ExperiencesHero />

      {/* 2. Pop-Up Dinners — Tastemakers series with upcoming event cards */}
      <PopUpDinners />

      {/* 3. Past Events Gallery — grid of event photos with captions */}
      <PastEventsGallery />

      {/* 4. Catering CTA — private chef and catering services */}
      <CateringCTA />

      {/* 5. Event Testimonials — reviews from event attendees */}
      <EventTestimonials />
    </>
  );
}
