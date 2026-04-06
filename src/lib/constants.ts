/* ============================================
   Soul Good - Placeholder Content & Constants
   ============================================ */

import type {
  Product,
  MealPlan,
  BlogPost,
  FAQ,
  Testimonial,
  MenuItem,
  Event,
  PhilosophyPillar,
  PressFeature,
  Recipe,
  NavLink,
} from "./types";

/* --- Brand --- */

export const BRAND = {
  name: "Soul Good",
  tagline: "Made with intention. Seasoned with love.",
  description:
    "Premium wellness food brand by Chef Kyla — Southern soul food meets functional healing nutrition.",
  deliveryArea: "Greater Los Angeles — Long Beach to Malibu, Valley to DTLA",
  email: "contact@soulgood.com",
  phone: "(310) 555-0172",
  social: {
    instagram: "https://instagram.com/soulgood",
    tiktok: "https://tiktok.com/@soulgood",
    youtube: "https://youtube.com/@soulgood",
  },
};

/* --- Navigation --- */

export const NAV_LINKS: NavLink[] = [
  { label: "MEAL PLANS", href: "/meal-plans" },
  { label: "SHOP", href: "/shop" },
  { label: "ABOUT", href: "/about" },
  { label: "EXPERIENCES", href: "/experiences" },
  { label: "BLOG", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "CONTACT", href: "/contact" },
];

export const SECONDARY_NAV_LINKS: NavLink[] = [
  { label: "Weekly Menu", href: "/menu" },
  {
    label: "Learn",
    href: "#",
    children: [
      { label: "About Chef Kyla", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Podcast", href: "/podcast" },
      { label: "Our Philosophy", href: "/about#philosophy" },
    ],
  },
  { label: "Sign In", href: "/account/login" },
];

export const FOOTER_LINKS = {
  mealPlans: [
    { label: "Compare Plans", href: "/meal-plans" },
    { label: "Performance Fuel", href: "/meal-plans/performance-fuel" },
    { label: "Full Alignment", href: "/meal-plans/full-alignment" },
    { label: "Weekly Menu", href: "/menu" },
    { label: "Delivery Areas", href: "/meal-plans#delivery" },
  ],
  learn: [
    { label: "About Chef Kyla", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Recipes", href: "/recipes" },
    { label: "Podcast", href: "/podcast" },
    { label: "Cannabis Chef", href: "/cannabis-chef" },
  ],
  information: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Catering", href: "/catering" },
    { label: "Community", href: "/community" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Gift Cards", href: "/gift-card" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

/* --- Announcement Bar Messages --- */

export const ANNOUNCEMENT_MESSAGES = [
  "FREE DELIVERY ON YOUR FIRST ORDER — USE CODE SOULGOOD",
  "CHEF-CRAFTED MEALS DELIVERED TO YOUR DOOR",
  "SUBSCRIBE & SAVE 15% ON ALL MEAL PLANS",
];

/* --- Meal Plans --- */

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "performance-fuel",
    slug: "performance-fuel",
    name: "Performance Fuel",
    tier: "performance-fuel",
    tagline: "Fuel your body. Elevate your day.",
    description:
      "Two chef-crafted meals and a cold-pressed juice daily, designed to optimize your performance and keep you energized from morning to night. Each meal is nutrient-dense, seasonally inspired, and rooted in ancestral wisdom.",
    longDescription:
      "Performance Fuel is your daily foundation for peak living. Each day, Chef Kyla prepares two nutrient-dense meals — lunch and dinner — along with a cold-pressed juice crafted from seasonal produce. Every recipe is rooted in the healing traditions of Southern soul food, elevated with modern nutritional science. Whether you're an athlete, a busy professional, or simply someone who believes food should work as hard as you do, Performance Fuel delivers clean, intentional nourishment without the hassle of meal prep.",
    includes: [
      "2 chef-crafted meals per day",
      "1 cold-pressed juice per day",
      "Seasonal menu rotation",
      "Nutritionist-approved macros",
    ],
    whatsIncludedDetailed: [
      {
        title: "Chef-Crafted Lunch",
        description:
          "A hearty, balanced midday meal featuring lean proteins, ancient grains, and vibrant seasonal vegetables. Designed for sustained energy without the afternoon crash.",
      },
      {
        title: "Chef-Crafted Dinner",
        description:
          "A nourishing evening meal that draws on Southern soul food traditions — slow-cooked, richly seasoned, and prepared with healing ingredients like turmeric, ginger, and leafy greens.",
      },
      {
        title: "Cold-Pressed Juice",
        description:
          "A daily dose of raw, cold-pressed nutrition. Our juices rotate seasonally and feature combinations like golden turmeric sunrise, green vitality, and beet berry detox.",
      },
      {
        title: "Seasonal Menu Rotation",
        description:
          "Our menu changes weekly to keep your palate excited and your body nourished with peak-season produce sourced from local farms whenever possible.",
      },
    ],
    pricing: {
      threeDayOneTime: 189,
      threeDaySubscription: 161,
      fiveDayOneTime: 299,
      fiveDaySubscription: 254,
    },
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop",
    faqs: [
      {
        id: "pf-faq-1",
        question: "What meals are included in Performance Fuel?",
        answer:
          "Performance Fuel includes two meals per day (lunch and dinner) plus one cold-pressed juice. Meals rotate weekly based on seasonal ingredients.",
        category: "meal-plans",
      },
      {
        id: "pf-faq-2",
        question: "Can I customize my meal selections?",
        answer:
          "While specific meal selection isn't available, you can indicate dietary preferences and restrictions, and our kitchen will accommodate them.",
        category: "meal-plans",
      },
      {
        id: "pf-faq-3",
        question: "How many calories are in each meal?",
        answer:
          "Each meal is designed to provide 500–700 calories of balanced macronutrients. Our nutritionist ensures every plate has the right balance of protein, healthy fats, and complex carbohydrates.",
        category: "meal-plans",
      },
      {
        id: "pf-faq-4",
        question: "Is Performance Fuel suitable for athletes?",
        answer:
          "Absolutely. Performance Fuel is designed with active individuals in mind. The macros are optimized for sustained energy, recovery, and lean muscle support.",
        category: "meal-plans",
      },
      {
        id: "pf-faq-5",
        question: "How do I store and reheat the meals?",
        answer:
          "All meals arrive fresh and should be refrigerated immediately. Most meals reheat beautifully in 2–3 minutes in the microwave or 5–7 minutes in the oven at 350°F. Juices should be consumed cold.",
        category: "meal-plans",
      },
    ],
    reviews: [
      {
        id: "pf-review-1",
        name: "Marcus T.",
        text: "As a former athlete, I'm picky about my nutrition. Chef Kyla's Performance Fuel plan gives me everything I need — clean fuel that actually tastes amazing.",
        rating: 5,
      },
      {
        id: "pf-review-2",
        name: "Jasmine R.",
        text: "I've been on Performance Fuel for three months and my energy levels have completely transformed. The lunches keep me going through my busiest days.",
        rating: 5,
      },
      {
        id: "pf-review-3",
        name: "Derek S.",
        text: "The juices alone are worth it. But the meals? Next level. I've tried every meal delivery in LA and this is the one that sticks.",
        rating: 5,
      },
    ],
  },
  {
    id: "full-alignment",
    slug: "full-alignment",
    name: "Full Alignment Fuel",
    tier: "full-alignment",
    tagline: "Complete nourishment for mind, body, and soul.",
    description:
      "Our most comprehensive plan — two meals, a cold-pressed juice, and a functional snack daily. Designed for those seeking full alignment through intentional, healing nutrition that honors both tradition and modern wellness science.",
    longDescription:
      "Full Alignment Fuel is the ultimate expression of Soul Good's philosophy: food as medicine, food as love. Every day, you receive two meticulously crafted meals, a cold-pressed juice, and a functional snack — each designed to work together as a complete system of nourishment. The snacks feature adaptogens, superfoods, and ancient ingredients chosen for their stress-relieving, gut-healing, and energy-sustaining properties. With priority delivery windows and our most comprehensive weekly menu, Full Alignment is for those who are ready to commit fully to their wellness journey.",
    includes: [
      "2 chef-crafted meals per day",
      "1 cold-pressed juice per day",
      "1 functional snack per day",
      "Seasonal menu rotation",
      "Nutritionist-approved macros",
      "Priority delivery windows",
    ],
    whatsIncludedDetailed: [
      {
        title: "Chef-Crafted Lunch",
        description:
          "A hearty, balanced midday meal featuring lean proteins, ancient grains, and vibrant seasonal vegetables. Designed for sustained energy without the afternoon crash.",
      },
      {
        title: "Chef-Crafted Dinner",
        description:
          "A nourishing evening meal rooted in Southern soul food traditions — slow-cooked, richly seasoned, and prepared with healing ingredients like turmeric, ginger, and leafy greens.",
      },
      {
        title: "Cold-Pressed Juice",
        description:
          "A daily dose of raw, cold-pressed nutrition. Our juices rotate seasonally and feature combinations like golden turmeric sunrise, green vitality, and beet berry detox.",
      },
      {
        title: "Functional Snack",
        description:
          "Handcrafted adaptogen energy bites, turmeric-ginger bars, or superfood trail mixes — each designed to bridge your meals with sustained energy and stress-relieving functional ingredients.",
      },
      {
        title: "Priority Delivery Windows",
        description:
          "Full Alignment members get first pick of delivery windows, ensuring your meals arrive exactly when you need them — Sunday evening or early Monday morning.",
      },
      {
        title: "Seasonal Menu Rotation",
        description:
          "Our menu changes weekly, sourcing peak-season produce from local farms to keep flavors fresh and nutrients at their highest potency.",
      },
    ],
    pricing: {
      threeDayOneTime: 239,
      threeDaySubscription: 203,
      fiveDayOneTime: 379,
      fiveDaySubscription: 322,
    },
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1600&h=900&fit=crop",
    faqs: [
      {
        id: "fa-faq-1",
        question: "What's the difference between Full Alignment and Performance Fuel?",
        answer:
          "Full Alignment includes everything in Performance Fuel plus a daily functional snack and priority delivery windows. It's our most comprehensive wellness plan.",
        category: "meal-plans",
      },
      {
        id: "fa-faq-2",
        question: "What kind of snacks are included?",
        answer:
          "Functional snacks rotate weekly and include items like adaptogen energy bites, turmeric-ginger bars, and superfood trail mixes — all made from scratch.",
        category: "meal-plans",
      },
      {
        id: "fa-faq-3",
        question: "What are adaptogens and why are they in the snacks?",
        answer:
          "Adaptogens are natural herbs and mushrooms — like ashwagandha, reishi, and maca — that help your body manage stress, boost immunity, and sustain energy. We incorporate them into our snacks for functional benefits beyond basic nutrition.",
        category: "meal-plans",
      },
      {
        id: "fa-faq-4",
        question: "What does priority delivery mean?",
        answer:
          "Full Alignment members receive their deliveries first during each delivery window. You'll be among the first to receive your weekly meals, typically Sunday evening between 5–7 PM or Monday morning between 6–8 AM.",
        category: "meal-plans",
      },
      {
        id: "fa-faq-5",
        question: "Can I switch between Full Alignment and Performance Fuel?",
        answer:
          "Yes! Subscribers can switch plans at any time. Changes made by Thursday at midnight will apply to the following week's delivery.",
        category: "meal-plans",
      },
    ],
    reviews: [
      {
        id: "fa-review-1",
        name: "Chris B.",
        text: "The Full Alignment plan is a game changer. The snacks are just as thoughtful as the meals, and the juice is the best I've ever had. Period.",
        rating: 5,
      },
      {
        id: "fa-review-2",
        name: "Tanya W.",
        text: "I've tried every meal delivery service in LA. Soul Good is different — it feels like someone who actually cares is cooking for you. Because they are.",
        rating: 5,
      },
      {
        id: "fa-review-3",
        name: "Alicia M.",
        text: "The energy bites are addictive and the priority delivery is so convenient. Full Alignment has become an essential part of my weekly routine.",
        rating: 5,
      },
    ],
  },
];

/* --- Products --- */

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "soul-seasoning-blend",
    name: "Soul Seasoning Blend",
    subtitle: "The flavor of home, reimagined",
    description:
      "Our signature all-purpose seasoning combines smoked paprika, garlic, onion, herbs, and a hint of cayenne. Perfect for elevating any dish with Soul Good flavor.",
    price: 18,
    subscriptionPrice: 15.3,
    category: "seasonings",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 124,
    badge: "best-seller",
    benefits: [
      "All-natural ingredients",
      "No artificial preservatives",
      "Rich in antioxidants from turmeric and paprika",
    ],
    howToUse:
      "Sprinkle generously on proteins, vegetables, soups, and stews. Use as a rub for grilling or roasting.",
    ingredients:
      "Smoked paprika, garlic powder, onion powder, oregano, thyme, black pepper, cayenne, sea salt, turmeric.",
    inStock: true,
  },
  {
    id: "prod-2",
    slug: "green-vitality-juice",
    name: "Green Vitality Juice",
    subtitle: "Cold-pressed daily greens",
    description:
      "A nutrient-packed cold-pressed juice featuring kale, spinach, cucumber, green apple, lemon, and ginger. Start your day with vibrant energy.",
    price: 12,
    subscriptionPrice: 10.2,
    category: "juices",
    images: [
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 89,
    badge: "best-seller",
    benefits: [
      "100% cold-pressed",
      "Rich in vitamins A, C, and K",
      "Supports immune function and digestion",
    ],
    howToUse:
      "Enjoy first thing in the morning on an empty stomach for maximum nutrient absorption. Shake well before drinking.",
    ingredients:
      "Kale, spinach, cucumber, green apple, lemon, ginger, filtered water.",
    inStock: true,
  },
  {
    id: "prod-3",
    slug: "heritage-hot-sauce",
    name: "Heritage Hot Sauce",
    subtitle: "Slow-roasted heat with depth",
    description:
      "A small-batch hot sauce crafted from slow-roasted habaneros, roasted garlic, and apple cider vinegar. Complex heat with smoky depth — not just spice.",
    price: 14,
    subscriptionPrice: 11.9,
    category: "seasonings",
    images: [
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&h=800&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 67,
    benefits: [
      "Small-batch crafted",
      "Capsaicin supports metabolism",
      "No added sugar or artificial flavors",
    ],
    howToUse:
      "Add to eggs, tacos, soups, rice bowls, or anywhere you want a flavor kick. A little goes a long way.",
    ingredients:
      "Habanero peppers, roasted garlic, apple cider vinegar, sea salt, onion, smoked paprika.",
    inStock: true,
  },
  {
    id: "prod-4",
    slug: "wellness-bundle",
    name: "The Wellness Bundle",
    subtitle: "Everything you need to get started",
    description:
      "Our most popular bundle — includes Soul Seasoning Blend, Heritage Hot Sauce, and Green Vitality Juice. The perfect introduction to the Soul Good pantry.",
    price: 38,
    subscriptionPrice: 32.3,
    category: "bundles",
    images: [
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 42,
    badge: "bundle-save",
    benefits: [
      "Save 15% compared to buying individually",
      "Perfect starter kit",
      "Free shipping included",
    ],
    howToUse:
      "Use the seasoning and hot sauce to elevate your cooking, and enjoy the juice as your daily wellness ritual.",
    ingredients: "See individual product pages for full ingredient lists.",
    inStock: true,
  },
  {
    id: "prod-5",
    slug: "turmeric-ginger-elixir",
    name: "Turmeric Ginger Elixir",
    subtitle: "Anti-inflammatory golden juice",
    description:
      "A warming cold-pressed elixir with turmeric, ginger, lemon, black pepper, and a touch of raw honey. Ancient healing meets modern wellness.",
    price: 12,
    subscriptionPrice: 10.2,
    category: "juices",
    images: [
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=600&h=800&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 55,
    benefits: [
      "Powerful anti-inflammatory properties",
      "Supports joint health",
      "Boosts immunity",
    ],
    howToUse:
      "Enjoy as a morning shot or dilute with warm water for a soothing tonic. Best consumed daily.",
    ingredients:
      "Turmeric root, ginger root, lemon juice, black pepper, raw honey, filtered water.",
    inStock: true,
  },
  {
    id: "prod-6",
    slug: "adaptogen-energy-bites",
    name: "Adaptogen Energy Bites",
    subtitle: "Functional fuel for your day",
    description:
      "Handcrafted energy bites loaded with ashwagandha, maca, cacao nibs, almond butter, and rolled oats. Sustained energy without the crash.",
    price: 16,
    subscriptionPrice: 13.6,
    category: "snacks",
    images: [
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 38,
    badge: "coming-soon",
    benefits: [
      "Adaptogen-powered stress relief",
      "Sustained clean energy",
      "No refined sugars",
    ],
    howToUse:
      "Enjoy 1-2 bites as a mid-morning or afternoon snack. Store refrigerated for best freshness.",
    ingredients:
      "Rolled oats, almond butter, raw honey, cacao nibs, ashwagandha powder, maca powder, chia seeds, vanilla extract, sea salt.",
    inStock: false,
  },
];

/* --- Blog Posts --- */

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "healing-power-of-soul-food",
    title: "The Healing Power of Soul Food",
    excerpt:
      "How traditional Southern cooking techniques and ingredients hold the key to modern wellness and healing.",
    content:
      "Soul food has long been misunderstood. While popular culture reduces it to heavy, indulgent comfort food, the roots of Southern cooking are deeply connected to healing, survival, and nourishment. At Soul Good, we honor these traditions while elevating them with modern nutritional science...",
    category: "soul-food-heritage",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-03-15",
    readTime: "6 min read",
  },
  {
    id: "blog-2",
    slug: "5-adaptogens-you-should-know",
    title: "5 Adaptogens You Should Know About",
    excerpt:
      "From ashwagandha to reishi, discover the functional ingredients that power our meal plans and snacks.",
    content:
      "Adaptogens are nature's stress-busters — herbs and mushrooms that help your body adapt to stress, support immune function, and promote balance. Here are five adaptogens we use at Soul Good and why they matter...",
    category: "nutrition",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-03-08",
    readTime: "5 min read",
  },
  {
    id: "blog-3",
    slug: "meal-prep-sunday-ritual",
    title: "The Sunday Meal Prep Ritual",
    excerpt:
      "Transform your week with intentional Sunday cooking. Here's how Chef Kyla approaches meal preparation.",
    content:
      "Every Sunday in the Soul Good kitchen begins with intention. Before a single ingredient is chopped, we set the tone for the week ahead. Meal prep isn't just about convenience — it's about creating a ritual of self-care...",
    category: "wellness",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-02-28",
    readTime: "7 min read",
  },
  {
    id: "blog-4",
    slug: "rainbow-bowl-recipe",
    title: "Chef Kyla's Rainbow Power Bowl",
    excerpt:
      "A vibrant, nutrient-dense bowl featuring seasonal vegetables, ancient grains, and our signature Soul Seasoning.",
    content:
      "This Rainbow Power Bowl is one of our most requested recipes. It's a celebration of color, flavor, and nutrition — everything Soul Good stands for. Each ingredient is chosen for both its taste and its healing properties.\n\n## The Foundation: Ancient Grains\n\nWe start with a base of organic quinoa and farro — two ancient grains that provide complete protein, fiber, and a satisfying chewy texture. These grains have nourished civilizations for thousands of years, and they're the perfect canvas for our rainbow of vegetables.\n\n## Building the Rainbow\n\nThe key to this bowl is color diversity. Each color represents different phytonutrients:\n\n- **Red**: Roasted beets and cherry tomatoes — rich in lycopene and betalains\n- **Orange**: Roasted sweet potato and shaved carrots — loaded with beta-carotene\n- **Yellow**: Turmeric-roasted cauliflower — anti-inflammatory powerhouse\n- **Green**: Massaged kale and edamame — iron, calcium, and plant protein\n- **Purple**: Shaved purple cabbage and blackberries — anthocyanins for brain health\n\n## The Soul Seasoning Tahini Dressing\n\nOur signature dressing brings everything together: creamy tahini, lemon juice, garlic, and our proprietary Soul Seasoning blend. It's the secret ingredient that makes this bowl uniquely Soul Good.\n\n## Instructions\n\n1. Cook quinoa and farro according to package directions\n2. Roast vegetables at 400°F for 25 minutes with olive oil and Soul Seasoning\n3. Massage kale with lemon juice and a pinch of salt\n4. Whisk together tahini dressing ingredients\n5. Assemble bowls with grains, roasted vegetables, fresh toppings, and dressing\n6. Garnish with microgreens and hemp seeds\n\nServe immediately and enjoy the full spectrum of flavor and nutrition.",
    category: "recipes",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-02-20",
    readTime: "4 min read",
  },
  {
    id: "blog-5",
    slug: "gut-health-and-fermented-foods",
    title: "Gut Health: The Power of Fermented Foods",
    excerpt:
      "Why fermented foods are a cornerstone of the Soul Good philosophy and how they can transform your digestion.",
    content:
      "Your gut is often called your 'second brain' — and for good reason. The trillions of microorganisms living in your digestive tract influence everything from mood to immunity. At Soul Good, fermented foods are a cornerstone of our approach to holistic wellness.\n\n## Why Fermentation Matters\n\nFermentation is one of humanity's oldest food preservation techniques. Long before refrigeration, cultures around the world discovered that fermenting foods not only extended their shelf life but also enhanced their nutritional value. The process creates beneficial probiotics, increases bioavailability of nutrients, and develops complex flavors.\n\n## Our Favorite Ferments\n\n- **Kimchi**: A Korean staple rich in vitamins A, B, and C\n- **Sauerkraut**: Traditional lacto-fermented cabbage packed with probiotics\n- **Miso**: A Japanese fermented soybean paste with deep umami flavor\n- **Kombucha**: Fermented tea that supports digestive health\n\n## How We Use Fermentation at Soul Good\n\nMany of our meal plans incorporate fermented elements — from house-made pickled vegetables to miso-glazed proteins. These ingredients don't just add flavor; they support your microbiome with every bite.",
    category: "nutrition",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-02-12",
    readTime: "6 min read",
  },
  {
    id: "blog-6",
    slug: "southern-greens-superfood",
    title: "Southern Greens: The Original Superfood",
    excerpt:
      "Collard greens, mustard greens, and turnip greens — the overlooked superfoods of Southern cuisine.",
    content:
      "Long before kale became a wellness buzzword, Black Southern cooks were building meals around nutrient-dense greens. Collards, mustard greens, and turnip greens are foundational to soul food — and they're packed with more vitamins, minerals, and phytonutrients than most modern 'superfoods.'\n\n## The Nutritional Powerhouse\n\nCollard greens alone provide exceptional amounts of vitamins K, A, and C, plus calcium, manganese, and fiber. When prepared the traditional way — slow-braised with aromatics — the 'pot liquor' (the cooking liquid) becomes a mineral-rich broth that our ancestors knew to never throw away.\n\n## Reclaiming Our Food Heritage\n\nAt Soul Good, we honor these traditions. Our greens are prepared with the same love and patience as our grandmothers used, but we've updated the technique: less sodium, no processed meats, and organic produce from local farms.\n\n## Chef Kyla's Tips for Perfect Greens\n\n1. Wash greens at least three times in cold water\n2. Remove the thick center stems for more tender texture\n3. Build flavor with smoked onion, garlic, and apple cider vinegar\n4. Low and slow is the key — simmer for at least 45 minutes\n5. Season with our Soul Seasoning blend for the perfect finish",
    category: "soul-food-heritage",
    image:
      "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-02-05",
    readTime: "5 min read",
  },
  {
    id: "blog-7",
    slug: "mindful-eating-practice",
    title: "The Art of Mindful Eating",
    excerpt:
      "How slowing down at the table can improve your digestion, reduce stress, and deepen your relationship with food.",
    content:
      "In our fast-paced world, most of us eat on autopilot — at our desks, in our cars, scrolling our phones. At Soul Good, we believe eating should be a mindful practice. When you slow down and truly experience your food, everything changes.\n\n## What Is Mindful Eating?\n\nMindful eating is the practice of bringing full attention to the experience of eating. It means noticing the colors, textures, aromas, and flavors of your food. It means chewing slowly and savoring each bite. It means listening to your body's hunger and fullness cues.\n\n## Benefits of Mindful Eating\n\n- **Better digestion**: Eating slowly allows your body to properly break down food\n- **Reduced stress**: Mealtime becomes a moment of calm in a busy day\n- **Greater satisfaction**: You feel more nourished with less food\n- **Emotional awareness**: You begin to notice the difference between physical hunger and emotional eating\n\n## How to Start\n\n1. Set your table intentionally — even if it's just for yourself\n2. Take three deep breaths before your first bite\n3. Put your fork down between bites\n4. Notice the flavors and textures as you chew\n5. Express gratitude for the hands that prepared your meal",
    category: "wellness",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-01-28",
    readTime: "5 min read",
  },
  {
    id: "blog-8",
    slug: "spicy-sweet-potato-soup",
    title: "Spicy Sweet Potato & Coconut Soup",
    excerpt:
      "A warming, nourishing soup recipe that blends Southern comfort with tropical flavors and anti-inflammatory spices.",
    content:
      "When the weather calls for something warm and comforting, this Spicy Sweet Potato & Coconut Soup delivers on every level. It's one of Chef Kyla's signature recipes that perfectly embodies the Soul Good philosophy: deeply satisfying, nutritionally dense, and made with intention.\n\n## Ingredients\n\n- 3 large sweet potatoes, peeled and diced\n- 1 can full-fat coconut milk\n- 1 yellow onion, diced\n- 3 cloves garlic, minced\n- 1 tablespoon fresh ginger, grated\n- 1 teaspoon turmeric\n- ½ teaspoon cayenne pepper\n- 4 cups vegetable broth\n- Soul Seasoning to taste\n- Coconut cream and cilantro for garnish\n\n## Instructions\n\n1. Sauté onion in olive oil until translucent\n2. Add garlic, ginger, turmeric, and cayenne — cook until fragrant\n3. Add sweet potatoes and broth, bring to a boil\n4. Simmer 20 minutes until potatoes are tender\n5. Blend until smooth, stir in coconut milk\n6. Season with Soul Seasoning, salt, and pepper\n7. Serve with a swirl of coconut cream and fresh cilantro\n\nThis soup keeps beautifully for 4 days in the refrigerator and freezes well for up to 3 months.",
    category: "recipes",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-01-20",
    readTime: "4 min read",
  },
  {
    id: "blog-9",
    slug: "anti-inflammatory-pantry",
    title: "Building an Anti-Inflammatory Pantry",
    excerpt:
      "Stock your kitchen with these essential anti-inflammatory ingredients and transform your everyday cooking.",
    content:
      "Chronic inflammation is at the root of many modern health challenges — from joint pain and fatigue to more serious conditions. The good news? Your kitchen can be your first line of defense. Here's how to build an anti-inflammatory pantry that supports healing with every meal.\n\n## The Essential Spices\n\n- **Turmeric**: The gold standard of anti-inflammatory spices\n- **Ginger**: Reduces inflammation and supports digestion\n- **Cinnamon**: Helps regulate blood sugar and reduce swelling\n- **Black pepper**: Enhances turmeric absorption by 2,000%\n\n## Healthy Fats\n\n- Extra virgin olive oil\n- Avocado and avocado oil\n- Raw nuts and seeds (walnuts, flaxseeds, chia seeds)\n- Coconut oil for high-heat cooking\n\n## Healing Staples\n\n- Bone broth or vegetable broth\n- Apple cider vinegar (raw, with the mother)\n- Raw honey and manuka honey\n- Green tea and herbal teas\n\nAt Soul Good, every ingredient in our meal plans is chosen with anti-inflammatory benefits in mind. When you eat with intention, your body responds with vitality.",
    category: "nutrition",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-01-12",
    readTime: "6 min read",
  },
  {
    id: "blog-10",
    slug: "history-of-gumbo",
    title: "The Rich History of Gumbo",
    excerpt:
      "From West Africa to the American South — tracing the cultural journey of one of soul food's most iconic dishes.",
    content:
      "Gumbo is more than a dish — it's a story of resilience, cultural fusion, and community. Its origins trace back to West Africa, where okra-based soups were a dietary staple. As enslaved Africans were brought to the American South, they carried these culinary traditions with them, adapting and evolving them with local ingredients.\n\n## A Melting Pot in a Pot\n\nGumbo is unique in that it reflects the cultural diversity of the Gulf Coast: West African okra, French roux technique, Native American filé powder, and Spanish sofrito influences all converge in a single bowl. It's the ultimate expression of culinary fusion born from necessity and creativity.\n\n## Chef Kyla's Approach\n\nAt Soul Good, our gumbo honors every thread of this rich tapestry. We use organic vegetables, sustainably sourced proteins, and our signature Soul Seasoning blend to create a version that's both deeply traditional and nutritionally conscious.\n\n## Why Heritage Matters\n\nUnderstanding where our food comes from connects us to something larger than ourselves. When you sit down to a bowl of gumbo, you're participating in a centuries-old tradition of nourishment, survival, and celebration.",
    category: "soul-food-heritage",
    image:
      "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-01-05",
    readTime: "7 min read",
  },
  {
    id: "blog-11",
    slug: "morning-wellness-routine",
    title: "Chef Kyla's Morning Wellness Routine",
    excerpt:
      "Start your day with intention — from warm lemon water to a gratitude practice, here's how Chef Kyla begins each morning.",
    content:
      "How you start your morning sets the tone for your entire day. Over the years, I've developed a morning routine that grounds me, energizes me, and prepares me for the creative demands of the Soul Good kitchen.\n\n## 5:30 AM — Warm Lemon Water\n\nBefore anything else, I drink a full glass of warm water with fresh lemon juice. This simple practice kickstarts digestion, hydrates the body, and provides a dose of vitamin C.\n\n## 5:45 AM — Movement\n\nI do 20 minutes of yoga or stretching. Nothing intense — just enough to wake up my body and connect with my breath.\n\n## 6:15 AM — Gratitude Practice\n\nI write three things I'm grateful for in my journal. This practice has transformed my mindset and keeps me focused on abundance rather than scarcity.\n\n## 6:30 AM — Nourishing Breakfast\n\nI prepare a simple, nutrient-dense breakfast: usually a smoothie bowl with berries, greens, hemp seeds, and our Soul Good granola, or avocado toast on sourdough with everything seasoning.\n\n## 7:00 AM — Set Daily Intention\n\nBefore heading to the kitchen, I set one clear intention for the day. It might be 'cook with joy' or 'listen more than I speak.' This single practice brings focus and purpose to everything that follows.",
    category: "wellness",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2024-12-28",
    readTime: "5 min read",
  },
  {
    id: "blog-12",
    slug: "herb-crusted-salmon",
    title: "Herb-Crusted Salmon with Citrus Glaze",
    excerpt:
      "A restaurant-quality salmon dish you can make at home in 30 minutes — packed with omega-3s and fresh herb flavor.",
    content:
      "This Herb-Crusted Salmon is a Soul Good staple. It's elegant enough for a dinner party but simple enough for a weeknight meal. The combination of fresh herbs, Dijon mustard, and bright citrus glaze creates layers of flavor that complement the rich, buttery salmon.\n\n## Ingredients\n\n- 4 wild-caught salmon fillets (6 oz each)\n- 2 tablespoons Dijon mustard\n- 1 cup fresh herbs (parsley, dill, chives), finely chopped\n- ½ cup panko breadcrumbs\n- Zest of 1 lemon and 1 orange\n- 2 tablespoons olive oil\n- Soul Seasoning to taste\n\n## For the Citrus Glaze\n\n- ¼ cup fresh orange juice\n- 2 tablespoons fresh lemon juice\n- 1 tablespoon raw honey\n- 1 teaspoon Dijon mustard\n\n## Instructions\n\n1. Preheat oven to 425°F\n2. Mix herbs, panko, citrus zest, and olive oil\n3. Brush salmon with Dijon mustard and season with Soul Seasoning\n4. Press herb mixture onto each fillet\n5. Bake for 12-15 minutes until crust is golden\n6. Meanwhile, simmer glaze ingredients until reduced by half\n7. Drizzle glaze over salmon and serve with roasted vegetables\n\nPair with our Rainbow Power Bowl for a complete, balanced meal.",
    category: "recipes",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2024-12-20",
    readTime: "4 min read",
  },
];

/* --- FAQs --- */

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What is Soul Good?",
    answer:
      "Soul Good is a premium wellness food brand founded by Chef Kyla. We deliver chef-crafted, nutrient-dense meal plans inspired by Southern soul food traditions, reimagined with modern functional nutrition.",
    category: "general",
  },
  {
    id: "faq-2",
    question: "Who is Chef Kyla?",
    answer:
      "Chef Kyla is a classically trained chef and certified nutrition specialist based in Los Angeles. She healed herself from obesity, hypertension, and elevated cortisol through intentional cooking — and now she's on a mission to help others do the same.",
    category: "general",
  },
  {
    id: "faq-3",
    question: "What's included in each meal plan?",
    answer:
      "Performance Fuel includes 2 meals and 1 cold-pressed juice per day. Full Alignment Fuel includes 2 meals, 1 juice, and 1 functional snack per day. Both plans rotate weekly with seasonal menus.",
    category: "meal-plans",
  },
  {
    id: "faq-4",
    question: "Can I choose between 3-day and 5-day plans?",
    answer:
      "Yes! Both Performance Fuel and Full Alignment Fuel are available as 3-day or 5-day plans, with subscription and one-time purchase options.",
    category: "meal-plans",
  },
  {
    id: "faq-5",
    question: "Where do you deliver?",
    answer:
      "We deliver throughout the Greater Los Angeles area — from Long Beach to Malibu, the Valley to DTLA, and everywhere in between.",
    category: "delivery",
  },
  {
    id: "faq-6",
    question: "When are meals delivered?",
    answer:
      "Meals are delivered Sunday evening or Monday morning. Twice-weekly delivery is also available for select areas.",
    category: "delivery",
  },
  {
    id: "faq-7",
    question: "How do I manage my subscription?",
    answer:
      "You can pause, skip, or cancel your subscription at any time through your account dashboard. Changes must be made by Thursday at midnight for the following week's delivery.",
    category: "subscription",
  },
  {
    id: "faq-8",
    question: "Is there a discount for subscribing?",
    answer:
      "Yes! Subscribers save 15% on every delivery compared to one-time orders.",
    category: "subscription",
  },
  {
    id: "faq-9",
    question: "Can you accommodate dietary restrictions?",
    answer:
      "Absolutely. We accommodate vegan, gluten-free, dairy-free, nut-free, and shellfish-free diets. Select your preferences when placing your order.",
    category: "dietary",
  },
  {
    id: "faq-10",
    question: "Are your meals allergen-friendly?",
    answer:
      "Our kitchen handles common allergens. While we take precautions, we cannot guarantee a completely allergen-free environment. Please contact us with specific allergy concerns.",
    category: "dietary",
  },
  {
    id: "faq-11",
    question: "How long do the meals stay fresh?",
    answer:
      "Meals are prepared fresh and should be consumed within 3 days of delivery. Juices are best enjoyed within 2 days. All items should be refrigerated immediately upon delivery.",
    category: "general",
  },
  {
    id: "faq-12",
    question: "Do you offer catering services?",
    answer:
      "Yes! Chef Kyla offers private chef services and catering for events of all sizes. Visit our Catering page to submit an inquiry.",
    category: "general",
  },
];

/* --- Testimonials --- */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Jasmine R.",
    text: "Soul Good completely transformed my relationship with food. The meals are incredible — you can taste the intention in every bite. I've lost 15 pounds and my energy has never been better.",
    rating: 5,
    category: "meal-prep",
  },
  {
    id: "test-2",
    name: "Marcus T.",
    text: "As a former athlete, I'm picky about my nutrition. Chef Kyla's Performance Fuel plan gives me everything I need — clean fuel that actually tastes amazing.",
    rating: 5,
    category: "meal-prep",
  },
  {
    id: "test-3",
    name: "Alicia M.",
    text: "The Tastemakers dinner was an unforgettable experience. Every course told a story and the energy in the room was electric. Can't wait for the next one.",
    rating: 5,
    category: "events",
  },
  {
    id: "test-4",
    name: "David & Nina L.",
    text: "Chef Kyla catered our anniversary dinner and it was beyond our expectations. Every dish was a masterpiece. Our guests are still talking about it.",
    rating: 5,
    category: "catering",
  },
  {
    id: "test-5",
    name: "Tanya W.",
    text: "I've tried every meal delivery service in LA. Soul Good is different — it feels like someone who actually cares is cooking for you. Because they are.",
    rating: 5,
    category: "meal-prep",
  },
  {
    id: "test-6",
    name: "Chris B.",
    text: "The Full Alignment plan is a game changer. The snacks are just as thoughtful as the meals, and the juice is the best I've ever had. Period.",
    rating: 4,
    category: "meal-prep",
  },
  {
    id: "test-7",
    name: "Shanice P.",
    text: "Chef Kyla catered our company wellness retreat and every single plate was perfection. She even customized the menu around our team's dietary needs. Truly above and beyond.",
    rating: 5,
    category: "catering",
  },
  {
    id: "test-8",
    name: "Jordan K.",
    text: "The Soul & Fire pop-up was the best dining experience I've had in LA. Open-fire cooking, incredible cocktails, and Chef Kyla's energy brought the whole night together.",
    rating: 5,
    category: "events",
  },
  {
    id: "test-9",
    name: "Renee & Andre W.",
    text: "We hired Chef Kyla for our wedding rehearsal dinner. The menu was a love letter to Southern cuisine — our families couldn't stop raving. Absolute magic.",
    rating: 5,
    category: "catering",
  },
  {
    id: "test-10",
    name: "Derek S.",
    text: "Three months on Performance Fuel and I feel like a different person. My trainer noticed the difference before I did. The juices alone are worth it.",
    rating: 5,
    category: "meal-prep",
  },
  {
    id: "test-11",
    name: "Monica G.",
    text: "Attended the Heritage Table dinner and left feeling so connected — to the food, the history, and the community. Chef Kyla is building something special.",
    rating: 5,
    category: "events",
  },
  {
    id: "test-12",
    name: "Brandon M.",
    text: "Had Chef Kyla cater a birthday dinner for 30 guests. The jerk cauliflower steak was the star of the night. Multiple guests asked for her contact information.",
    rating: 4,
    category: "catering",
  },
];

/* --- Weekly Menu --- */

export const WEEKLY_MENU: MenuItem[] = [
  {
    id: "menu-1",
    name: "Golden Turmeric Sunrise Juice",
    description:
      "Cold-pressed turmeric, ginger, lemon, and orange with a hint of black pepper for optimal absorption.",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
    mealType: "juice",
    dayOfWeek: "monday",
  },
  {
    id: "menu-2",
    name: "Herb-Crusted Salmon with Collard Greens",
    description:
      "Wild-caught salmon with a herb crust, served over braised collard greens with roasted sweet potatoes.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    mealType: "lunch",
    dayOfWeek: "monday",
  },
  {
    id: "menu-3",
    name: "Jerk-Spiced Cauliflower Steak",
    description:
      "Thick-cut cauliflower steak with Caribbean jerk seasoning, coconut rice, and mango salsa.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    mealType: "dinner",
    dayOfWeek: "monday",
  },
  {
    id: "menu-4",
    name: "Adaptogen Energy Bites",
    description:
      "Ashwagandha, maca, cacao nibs, and almond butter rolled in toasted coconut.",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    mealType: "snack",
    dayOfWeek: "monday",
  },
  {
    id: "menu-5",
    name: "Green Vitality Juice",
    description:
      "Kale, spinach, cucumber, green apple, lemon, and ginger — fresh-pressed daily.",
    image:
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
    mealType: "juice",
    dayOfWeek: "tuesday",
  },
  {
    id: "menu-6",
    name: "Blackened Chicken Power Bowl",
    description:
      "Blackened free-range chicken over quinoa with roasted vegetables, avocado, and tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    mealType: "lunch",
    dayOfWeek: "tuesday",
  },
  {
    id: "menu-7",
    name: "Southern Stuffed Bell Peppers",
    description:
      "Bell peppers filled with seasoned grass-fed beef, wild rice, tomatoes, and topped with Soul Seasoning.",
    image:
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&h=300&fit=crop",
    mealType: "dinner",
    dayOfWeek: "tuesday",
  },
  {
    id: "menu-8",
    name: "Beet Berry Detox Juice",
    description:
      "Red beet, mixed berries, apple, and lemon — a powerful antioxidant blend.",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
    mealType: "juice",
    dayOfWeek: "wednesday",
  },
  {
    id: "menu-9",
    name: "Grilled Shrimp & Avocado Salad",
    description:
      "Wild-caught shrimp over mixed greens with avocado, mango, red onion, and citrus vinaigrette.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    mealType: "lunch",
    dayOfWeek: "wednesday",
  },
  {
    id: "menu-10",
    name: "Braised Oxtail with Root Vegetables",
    description:
      "Slow-braised oxtail in red wine reduction with roasted root vegetables and herb gremolata.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    mealType: "dinner",
    dayOfWeek: "wednesday",
  },
  {
    id: "menu-11",
    name: "Citrus Immunity Juice",
    description:
      "Orange, grapefruit, lemon, turmeric, and cayenne — a citrus immunity booster.",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    mealType: "juice",
    dayOfWeek: "thursday",
  },
  {
    id: "menu-12",
    name: "Rainbow Power Bowl",
    description:
      "Ancient grains topped with roasted rainbow vegetables, pickled onions, and Soul Seasoning tahini.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    mealType: "lunch",
    dayOfWeek: "thursday",
  },
  {
    id: "menu-13",
    name: "Maple-Glazed Heritage Pork Chop",
    description:
      "Heritage pork chop with maple-bourbon glaze, sweet potato mash, and sautéed kale.",
    image:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop",
    mealType: "dinner",
    dayOfWeek: "thursday",
  },
  {
    id: "menu-14",
    name: "Tropical Green Juice",
    description:
      "Pineapple, spinach, coconut water, lime, and mint — a refreshing tropical blend.",
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop",
    mealType: "juice",
    dayOfWeek: "friday",
  },
  {
    id: "menu-15",
    name: "Coconut Curry Lentil Stew",
    description:
      "Red lentils in a fragrant coconut curry with sweet potatoes, spinach, and fresh cilantro.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    mealType: "lunch",
    dayOfWeek: "friday",
  },
  {
    id: "menu-16",
    name: "Pan-Seared Sea Bass with Mango Salsa",
    description:
      "Chilean sea bass with tropical mango salsa, jasmine rice, and grilled asparagus.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
    mealType: "dinner",
    dayOfWeek: "friday",
  },
];

/* --- Events --- */

export const EVENTS: Event[] = [
  {
    id: "event-1",
    name: "Tastemakers: Spring Awakening Dinner",
    description:
      "A 6-course pop-up dinner celebrating the season's first harvest. Featuring fermented and foraged ingredients paired with natural wines.",
    date: "2025-04-18",
    time: "7:00 PM",
    venue: "The Secret Garden, Venice Beach",
    price: 165,
    ticketUrl: "#",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
    isPast: false,
  },
  {
    id: "event-2",
    name: "Tastemakers: Soul & Fire",
    description:
      "An open-fire cooking experience blending Southern BBQ traditions with global spice profiles. Live music and craft cocktails included.",
    date: "2025-05-16",
    time: "6:30 PM",
    venue: "Malibu Beach House",
    price: 195,
    ticketUrl: "#",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
    isPast: false,
  },
  {
    id: "event-3",
    name: "Tastemakers: Heritage Table",
    description:
      "A celebration of ancestral recipes reimagined — from the African diaspora to the American South. An intimate 40-person dinner.",
    date: "2025-02-14",
    time: "7:00 PM",
    venue: "Downtown LA Loft",
    price: 150,
    ticketUrl: "#",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
    isPast: true,
  },
];

/* --- Philosophy Pillars --- */

export const PHILOSOPHY_PILLARS: PhilosophyPillar[] = [
  {
    id: "pillar-1",
    name: "Ancestral Wisdom",
    description:
      "We honor the cooking traditions passed down through generations — the slow braises, the hand-ground spices, the recipes that carried communities through hardship.",
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=500&fit=crop",
  },
  {
    id: "pillar-2",
    name: "Nutrient Density",
    description:
      "Every ingredient earns its place. We select foods at peak nutrition and prepare them in ways that maximize bioavailability and healing potential.",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=500&fit=crop",
  },
  {
    id: "pillar-3",
    name: "Eat the Rainbow",
    description:
      "Color is nutrition made visible. Our meals are designed to deliver a full spectrum of phytonutrients through vibrant, seasonal produce.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
  },
  {
    id: "pillar-4",
    name: "Functional Ingredients",
    description:
      "From adaptogens to fermented foods, we incorporate functional ingredients that support stress resilience, gut health, and sustained energy.",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop",
  },
  {
    id: "pillar-5",
    name: "Intentional Preparation",
    description:
      "Food prepared with love nourishes differently. We bring mindfulness and care to every step — from sourcing to plating.",
    image:
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=500&fit=crop",
  },
];

/* --- Press Features --- */

export const PRESS_FEATURES: PressFeature[] = [
  {
    id: "press-1",
    name: "Los Angeles Times",
    quote:
      "Chef Kyla is redefining what soul food means for a new generation of health-conscious eaters.",
  },
  {
    id: "press-2",
    name: "Bon Appétit",
    quote:
      "Soul Good delivers the kind of nourishment that makes you feel seen — food as medicine, food as love.",
  },
  {
    id: "press-3",
    name: "Well+Good",
    quote:
      "The meal plan that's changing the wellness game in Los Angeles.",
  },
  {
    id: "press-4",
    name: "Essence",
    quote:
      "Chef Kyla brings ancestral healing to the modern plate with grace, flavor, and intention.",
  },
];

/* --- Recipes --- */

export const RECIPES: Recipe[] = [
  {
    id: "recipe-1",
    slug: "rainbow-power-bowl",
    title: "Rainbow Power Bowl",
    description:
      "A vibrant bowl of ancient grains, roasted rainbow vegetables, and Soul Seasoning tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    prepTime: "30 min",
    servings: 2,
    difficulty: "easy",
    category: "bowls",
  },
  {
    id: "recipe-2",
    slug: "golden-turmeric-latte",
    title: "Golden Turmeric Latte",
    description:
      "A warming, anti-inflammatory latte made with fresh turmeric, ginger, oat milk, and a touch of honey.",
    image:
      "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=800&h=500&fit=crop",
    prepTime: "10 min",
    servings: 1,
    difficulty: "easy",
    category: "drinks",
  },
  {
    id: "recipe-3",
    slug: "blackened-fish-tacos",
    title: "Blackened Fish Tacos with Mango Slaw",
    description:
      "Crispy blackened fish in corn tortillas with fresh mango slaw and avocado crema.",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=500&fit=crop",
    prepTime: "25 min",
    servings: 4,
    difficulty: "medium",
    category: "mains",
  },
  {
    id: "recipe-4",
    slug: "collard-green-wraps",
    title: "Collard Green Wraps",
    description:
      "Fresh collard green leaves wrapped around seasoned quinoa, roasted vegetables, and herbed hummus.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop",
    prepTime: "20 min",
    servings: 2,
    difficulty: "easy",
    category: "mains",
  },
  {
    id: "recipe-5",
    slug: "sweet-potato-coconut-soup",
    title: "Sweet Potato & Coconut Soup",
    description:
      "A warming, anti-inflammatory soup with roasted sweet potatoes, coconut milk, and ginger.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop",
    prepTime: "40 min",
    servings: 4,
    difficulty: "easy",
    category: "soups",
  },
  {
    id: "recipe-6",
    slug: "herb-crusted-salmon",
    title: "Herb-Crusted Salmon",
    description:
      "Wild-caught salmon with a fresh herb crust and bright citrus glaze. Packed with omega-3s.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop",
    prepTime: "30 min",
    servings: 4,
    difficulty: "medium",
    category: "mains",
  },
  {
    id: "recipe-7",
    slug: "berry-smoothie-bowl",
    title: "Berry Adaptogen Smoothie Bowl",
    description:
      "A creamy smoothie bowl loaded with antioxidant-rich berries, ashwagandha, and crunchy toppings.",
    image:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=500&fit=crop",
    prepTime: "10 min",
    servings: 1,
    difficulty: "easy",
    category: "bowls",
  },
  {
    id: "recipe-8",
    slug: "jerk-cauliflower-bites",
    title: "Jerk Cauliflower Bites",
    description:
      "Crispy roasted cauliflower tossed in a homemade jerk seasoning with cooling tahini dip.",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=500&fit=crop",
    prepTime: "35 min",
    servings: 4,
    difficulty: "medium",
    category: "snacks",
  },
  {
    id: "recipe-9",
    slug: "green-detox-juice",
    title: "Green Detox Juice",
    description:
      "A refreshing cold-pressed juice with kale, cucumber, apple, lemon, and ginger for daily detox.",
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=500&fit=crop",
    prepTime: "15 min",
    servings: 2,
    difficulty: "easy",
    category: "drinks",
  },
];

/* --- Delivery Areas --- */

export const DELIVERY_AREAS = [
  "Long Beach",
  "Torrance",
  "Inglewood",
  "Culver City",
  "Santa Monica",
  "Venice",
  "Westwood",
  "Beverly Hills",
  "West Hollywood",
  "Hollywood",
  "Silver Lake",
  "Echo Park",
  "Downtown LA",
  "Pasadena",
  "Glendale",
  "Burbank",
  "Sherman Oaks",
  "Encino",
  "Woodland Hills",
  "Calabasas",
  "Malibu",
];

/* --- Category Navigation --- */

export const CATEGORY_NAV = [
  {
    label: "MEAL PLANS",
    href: "/meal-plans",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    label: "SHOP",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop",
  },
  {
    label: "EXPERIENCES",
    href: "/experiences",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  },
];
