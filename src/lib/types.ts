/* ============================================
   Soul Good - TypeScript Interfaces
   ============================================ */

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  subscriptionPrice: number;
  category: "seasonings" | "juices" | "bundles" | "snacks";
  images: string[];
  rating: number;
  reviewCount: number;
  badge?: "best-seller" | "coming-soon" | "bundle-save";
  benefits: string[];
  howToUse: string;
  ingredients: string;
  inStock: boolean;
}

export interface MealPlanIncludedItem {
  title: string;
  description: string;
}

export interface MealPlanReview {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface MealPlan {
  id: string;
  slug: string;
  name: string;
  tier: "performance-fuel" | "full-alignment";
  tagline: string;
  description: string;
  longDescription: string;
  includes: string[];
  whatsIncludedDetailed: MealPlanIncludedItem[];
  pricing: {
    threeDayOneTime: number;
    threeDaySubscription: number;
    fiveDayOneTime: number;
    fiveDaySubscription: number;
  };
  image: string;
  heroImage: string;
  faqs: FAQ[];
  reviews: MealPlanReview[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "recipes" | "wellness" | "soul-food-heritage" | "nutrition";
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "meal-plans" | "delivery" | "subscription" | "dietary";
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  category: "meal-prep" | "events" | "catering";
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "juice";
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  ticketUrl: string;
  image: string;
  isPast: boolean;
}

export interface CateringInquiry {
  name: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  budgetRange: string;
  eventDate: string;
  eventTime: string;
  location: string;
  eventType: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string;
  serviceType: string;
  additionalNotes: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PhilosophyPillar {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface PressFeature {
  id: string;
  name: string;
  quote: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  servings: number;
  difficulty: "easy" | "medium" | "advanced";
  category: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}
