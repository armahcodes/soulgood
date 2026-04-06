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
    includes: [
      "2 chef-crafted meals per day",
      "1 cold-pressed juice per day",
      "Seasonal menu rotation",
      "Nutritionist-approved macros",
    ],
    pricing: {
      threeDayOneTime: 189,
      threeDaySubscription: 161,
      fiveDayOneTime: 299,
      fiveDaySubscription: 254,
    },
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
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
    includes: [
      "2 chef-crafted meals per day",
      "1 cold-pressed juice per day",
      "1 functional snack per day",
      "Seasonal menu rotation",
      "Nutritionist-approved macros",
      "Priority delivery windows",
    ],
    pricing: {
      threeDayOneTime: 239,
      threeDaySubscription: 203,
      fiveDayOneTime: 379,
      fiveDaySubscription: 322,
    },
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
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
      "This Rainbow Power Bowl is one of our most requested recipes. It's a celebration of color, flavor, and nutrition — everything Soul Good stands for. Each ingredient is chosen for both its taste and its healing properties...",
    category: "recipes",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    author: "Chef Kyla",
    date: "2025-02-20",
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
