"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Accordion } from "@/components/ui/Accordion";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Rating } from "@/components/ui/Rating";
import { Carousel } from "@/components/ui/Carousel";

const accordionItems = [
  {
    id: "acc-1",
    title: "What is Soul Good?",
    content:
      "Soul Good is a premium wellness food brand by Chef Kyla. Southern soul food meets functional healing nutrition.",
  },
  {
    id: "acc-2",
    title: "How does delivery work?",
    content:
      "We deliver throughout the Greater LA area — from Long Beach to Malibu, the Valley to DTLA.",
  },
  {
    id: "acc-3",
    title: "Can I customize my meals?",
    content:
      "You can indicate dietary preferences and restrictions, and our kitchen will accommodate them.",
  },
];

const carouselSlides = [
  { label: "Slide 1", color: "bg-primary/20" },
  { label: "Slide 2", color: "bg-accent/20" },
  { label: "Slide 3", color: "bg-primary-dark/20" },
  { label: "Slide 4", color: "bg-cream-dark" },
  { label: "Slide 5", color: "bg-cream-darker" },
];

export default function UITestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleInputBlur = () => {
    if (!inputValue.trim()) {
      setInputError("This field is required");
    } else {
      setInputError("");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <h1 className="font-heading text-5xl mb-4">UI Component Library</h1>
        <p className="font-body text-lg text-black/60 mb-16">
          All shared components for the Soul Good design system.
        </p>

        {/* ===== BUTTONS ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Buttons</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Primary (black bg), Secondary (outlined), Link style — 0px border-radius, 0.7s easeOutQuart.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary">Primary Button</Button>
            <Button variant="primary" size="sm">Primary Small</Button>
            <Button variant="primary" size="lg">Primary Large</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="secondary" size="sm">Secondary Small</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* ===== CARDS ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Cards</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            No border, no shadow, rectangular. Composed of CardImage, CardContent, CardTitle, CardDescription.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardImage>
                <div className="w-full h-full bg-cream-dark flex items-center justify-center">
                  <span className="label-text text-black/40">3:4 Image</span>
                </div>
              </CardImage>
              <CardContent>
                <CardTitle>Soul Seasoning Blend</CardTitle>
                <CardDescription>The flavor of home, reimagined</CardDescription>
              </CardContent>
            </Card>
            <Card as="article">
              <CardImage aspectRatio="16/9">
                <div className="w-full h-full bg-cream-darker flex items-center justify-center">
                  <span className="label-text text-black/40">16:9 Image</span>
                </div>
              </CardImage>
              <CardContent>
                <CardTitle>Green Vitality Juice</CardTitle>
                <CardDescription>Cold-pressed daily greens</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardImage>
                <div className="w-full h-full bg-gray-light flex items-center justify-center">
                  <span className="label-text text-black/40">Product</span>
                </div>
              </CardImage>
              <CardContent>
                <CardTitle>Heritage Hot Sauce</CardTitle>
                <CardDescription>Slow-roasted heat with depth</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ===== BADGES & TAGS ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Badges &amp; Tags</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Compact with accent color bg, uppercase label text.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge>Best Seller</Badge>
            <Badge variant="accent">New</Badge>
            <Badge variant="dark">Bundle &amp; Save</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Tag>Recipes</Tag>
            <Tag>Wellness</Tag>
            <Tag variant="outline">Soul Food Heritage</Tag>
            <Tag variant="outline">Nutrition</Tag>
          </div>
        </section>

        {/* ===== ACCORDION ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Accordion</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Smooth height animation, chevron icon rotation on expand/collapse.
          </p>
          <div className="max-w-xl">
            <Accordion items={accordionItems} />
          </div>
        </section>

        {/* ===== MODAL ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Modal</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Centered with backdrop blur, translateY animation. Closes on Escape or backdrop click.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal Example"
          >
            <p className="font-body text-sm text-black/70 mb-6">
              This modal demonstrates centered positioning with backdrop blur and a smooth
              translateY entrance animation. Press Escape or click outside to close.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </section>

        {/* ===== INPUT ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Input</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Bottom-border style, 0px border-radius. Labels, error states, and helper text.
          </p>
          <div className="max-w-md space-y-6">
            <Input
              label="Email Address"
              placeholder="you@example.com"
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputBlur}
              error={inputError}
            />
            <Input
              label="Full Name"
              placeholder="Chef Kyla"
              helperText="Enter your full name"
            />
            <Input
              label="With Error"
              placeholder="Type something..."
              error="This field is required"
            />
          </div>
        </section>

        {/* ===== RATING ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Rating</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Star rating display with accent (terracotta) color fill. Supports partial stars.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Rating value={5} />
              <span className="font-sans text-sm text-black/60">5.0 — Perfect</span>
            </div>
            <div className="flex items-center gap-4">
              <Rating value={4.5} showValue />
              <span className="font-sans text-sm text-black/60">Partial star</span>
            </div>
            <div className="flex items-center gap-4">
              <Rating value={3.7} size="lg" showValue />
              <span className="font-sans text-sm text-black/60">Large size</span>
            </div>
            <div className="flex items-center gap-4">
              <Rating value={2} size="sm" />
              <span className="font-sans text-sm text-black/60">Small size, 2 stars</span>
            </div>
          </div>
        </section>

        {/* ===== CAROUSEL ===== */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl mb-2">Carousel</h2>
          <p className="font-body text-sm text-black/50 mb-8">
            Swiper.js wrapper with navigation arrows and pagination. Hover to show arrows.
          </p>
          <Carousel
            slidesPerView={1}
            spaceBetween={24}
            showNavigation
            showPagination
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {carouselSlides.map((slide) => (
              <div
                key={slide.label}
                className={`${slide.color} h-64 flex items-center justify-center`}
              >
                <span className="label-text text-black/60 text-lg">{slide.label}</span>
              </div>
            ))}
          </Carousel>
        </section>
      </div>
    </main>
  );
}
