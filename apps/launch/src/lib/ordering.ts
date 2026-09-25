/**
 * Eat Now is the published Square Online menu, separate from our meal-plan cart.
 * Keep this a fixed, public destination. Never append contact details, auth
 * tokens, payment state, or a meal-plan checkout reference to this URL.
 */
export const EAT_NOW = {
  menuUrl: "https://checkout.soulgood.kitchen/s/order",
  infoPath: "/eat-now",
  returnUrl: "https://www.soulgood.kitchen/eat-now#order-help",
  days: "Thursday–Sunday",
  radiusMiles: 20,
  fulfillment: "On-demand couriers or a Soul Good courier",
  deliveryDetails:
    "Eat Now orders may be delivered by on-demand courier partners such as Uber Direct or DoorDash, or by a Soul Good courier, depending on availability.",
  coverage:
    "On-demand delivery runs Thursday through Sunday within about 20 miles of our Long Beach kitchen. A courier fee is added at checkout unless your order is over $100. Every order has a $50 minimum.",
  availability:
    "Check the menu for current items, service times, and pickup or delivery options. Courier availability and delivery coverage depend on your address. Review tax, courier fees, and your total at Eat Now checkout before paying.",
} as const;
