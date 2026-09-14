/**
 * Eat Now is the published Square Online menu, separate from our meal-plan cart.
 * Keep this a fixed, public destination. Never append contact details, auth
 * tokens, payment state, or a meal-plan checkout reference to this URL.
 */
export const EAT_NOW = {
  menuUrl: "https://checkout.soulgood.kitchen/s/order",
  infoPath: "/eat-now",
  returnUrl: "https://www.soulgood.kitchen/eat-now#order-help",
  fulfillment: "Courier partners or a Soul Good courier",
  deliveryDetails:
    "Eat Now orders may be delivered by courier partners such as DoorDash, Uber Eats, or Postmates, or by a Soul Good courier, depending on availability.",
  availability:
    "Check the menu for current items, service times, and pickup or delivery options. Courier availability and delivery coverage depend on your address. Review tax, delivery charges, and your total at Eat Now checkout before paying.",
} as const;
