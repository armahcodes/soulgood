import { randomUUID } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import process from "node:process";

const API_VERSION = "2026-08-19";
const CATEGORY_NAME = "Soul Bowls™";
const PLAN_NAME = "Soul Bowls™ Weekly";
const PLAN_VARIATION_NAME = "Itemized weekly Soul Bowls™";
const UNIT_PRICE_CENTS = 1760;

const PRODUCTS = [
  {
    id: "glow-bowl",
    env: "SQUARE_GLOW_BOWL_VARIATION_ID",
    name: "Glow Bowl™",
    available: true,
    serving: "Cold or warm",
    ingredients: "Greens, quinoa, cucumber, avocado, herbs, and lemon dressing.",
    dietary: ["Made fresh", "Plant-forward"],
    image: "glow1.png",
  },
  {
    id: "golden-harvest-bowl",
    env: "SQUARE_GOLDEN_HARVEST_BOWL_VARIATION_ID",
    name: "Golden Harvest Bowl™",
    available: true,
    serving: "Cold or warm",
    ingredients:
      "Roasted sweet potato, carrots, quinoa, chickpeas, greens, and tahini herb dressing.",
    dietary: ["Plant-forward", "Protein-rich"],
    allergen: "Contains sesame",
    image: "goldenharvest.png",
  },
  {
    id: "jerk-wellness-bowl",
    env: "SQUARE_JERK_WELLNESS_BOWL_VARIATION_ID",
    name: "Jerk Wellness Bowl™",
    available: true,
    serving: "Cold or warm",
    ingredients:
      "Jerk chicken, brown rice, roasted vegetables, greens, herbs, and jerk sauce.",
    dietary: ["Rooted in nature", "Clean ingredients"],
    allergen: "Marinade may contain soy or wheat",
    image: "jerkwellness.png",
  },
  {
    id: "performance-power-bowl",
    env: "SQUARE_PERFORMANCE_POWER_BOWL_VARIATION_ID",
    name: "Performance Power Bowl™",
    available: true,
    serving: "Cold or warm",
    ingredients:
      "Grilled chicken, brown rice, sweet potato, broccoli, herbs, and house dressing.",
    dietary: ["Higher protein", "Performance fuel"],
    image: "performance.png",
  },
  {
    id: "herb-chicken-nourish-bowl",
    env: "SQUARE_HERB_CHICKEN_BOWL_VARIATION_ID",
    name: "Herb Chicken Nourish Bowl™",
    available: false,
    serving: "Cold or warm",
    ingredients:
      "Herb chicken, quinoa, greens, roasted vegetables, herbs, and light dressing.",
    dietary: ["Clean, balanced flavors", "Mindful nourishment"],
    image: "herbchicken.png",
  },
  {
    id: "anti-inflammatory-bowl",
    env: "SQUARE_ANTI_INFLAMMATORY_BOWL_VARIATION_ID",
    name: "Anti-Inflammatory Bowl™",
    available: true,
    serving: "Cold or warm",
    ingredients:
      "Turmeric rice, chickpeas, greens, roasted vegetables, herbs, and turmeric dressing.",
    dietary: ["Plant-forward", "Turmeric-forward"],
    image: "ChatGPT Image Aug 31, 2026, 01_04_32 PM (6).png",
  },
];

function loadLocalEnv(contents) {
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

await loadLocalEnv(await readFile(new URL("../.env", import.meta.url), "utf8"));

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
if (!accessToken) throw new Error("SQUARE_ACCESS_TOKEN is not configured");
const baseUrl =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

async function squareRequest(endpoint, init = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": API_VERSION,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const codes = (body.errors ?? []).map((error) => error.code).filter(Boolean);
    throw new Error(`Square request failed (${response.status}): ${codes.join(", ")}`);
  }
  return body;
}

async function listCatalogObjects(types) {
  const objects = [];
  let cursor;
  do {
    const params = new URLSearchParams({ types });
    if (cursor) params.set("cursor", cursor);
    const body = await squareRequest(`/v2/catalog/list?${params}`);
    objects.push(...(body.objects ?? []));
    cursor = body.cursor;
  } while (cursor);
  return objects;
}

async function listAllItems() {
  const items = [];
  let cursor;
  do {
    const body = await squareRequest("/v2/catalog/search-catalog-items", {
      method: "POST",
      body: JSON.stringify({
        archived_state: "ARCHIVED_STATE_ALL",
        ...(cursor ? { cursor } : {}),
      }),
    });
    items.push(...(body.items ?? []));
    cursor = body.cursor;
  } while (cursor);
  return items;
}

async function upsertCatalogObject(object) {
  return squareRequest("/v2/catalog/object", {
    method: "POST",
    body: JSON.stringify({ idempotency_key: randomUUID(), object }),
  });
}

const catalogObjects = await listCatalogObjects("CATEGORY,SUBSCRIPTION_PLAN");
let category = catalogObjects.find(
  (object) => object.type === "CATEGORY" && object.category_data?.name === CATEGORY_NAME,
);
if (!category) {
  const body = await upsertCatalogObject({
    type: "CATEGORY",
    id: "#soul-bowls-category",
    present_at_all_locations: true,
    category_data: { name: CATEGORY_NAME },
  });
  category = body.catalog_object;
}
if (!category?.id) throw new Error("Square did not return the Soul Bowls category");

const existingItems = await listAllItems();
const variationIds = {};
const itemIds = {};

for (const product of PRODUCTS) {
  const sku = `SOUL-BOWLS-${product.id.toUpperCase()}-32OZ`;
  const existing = existingItems.find((item) =>
    item.item_data?.variations?.some(
      (variation) => variation.item_variation_data?.sku === sku,
    ),
  );
  const existingVariation = existing?.item_data?.variations?.find(
    (variation) => variation.item_variation_data?.sku === sku,
  );
  const itemId = existing?.id ?? `#item-${product.id}`;
  const variationId = existingVariation?.id ?? `#variation-${product.id}`;
  const description = [
    `<p><strong>32 oz Soul Bowl™</strong> · ${product.serving}</p>`,
    `<p><strong>Ingredients:</strong> ${product.ingredients}</p>`,
    `<p><strong>Details:</strong> ${product.dietary.join(" · ")}</p>`,
    ...(product.allergen
      ? [`<p><strong>Allergen notice:</strong> ${product.allergen}</p>`]
      : []),
    "<p>Keep refrigerated. Follow the prep and eat-by dates on the jar.</p>",
  ].join("");
  const body = await upsertCatalogObject({
    type: "ITEM",
    id: itemId,
    ...(existing?.version ? { version: existing.version } : {}),
    present_at_all_locations: true,
    item_data: {
      name: product.name,
      description_html: description,
      product_type: "REGULAR",
      is_archived: !product.available,
      categories: [{ id: category.id }],
      reporting_category: { id: category.id },
      ...(existing?.item_data?.image_ids?.length
        ? { image_ids: existing.item_data.image_ids }
        : {}),
      variations: [
        {
          type: "ITEM_VARIATION",
          id: variationId,
          ...(existingVariation?.version ? { version: existingVariation.version } : {}),
          present_at_all_locations: true,
          item_variation_data: {
            item_id: itemId,
            name: "32 oz jar",
            sku,
            pricing_type: "FIXED_PRICING",
            price_money: { amount: UNIT_PRICE_CENTS, currency: "USD" },
            track_inventory: false,
            user_data: `soul-bowls:${product.id}`,
          },
        },
      ],
    },
  });
  const savedItem = body.catalog_object;
  const savedVariation = savedItem?.item_data?.variations?.[0];
  if (!savedItem?.id || !savedVariation?.id) {
    throw new Error(`Square did not return IDs for ${product.name}`);
  }
  itemIds[product.id] = savedItem.id;
  variationIds[product.env] = savedVariation.id;

  if (!savedItem.item_data?.image_ids?.length) {
    const imagePath = path.join(
      process.env.SOUL_BOWLS_IMAGE_DIR ?? path.join(homedir(), "Downloads"),
      product.image,
    );
    try {
      await access(imagePath);
      const form = new FormData();
      form.append("file", new Blob([await readFile(imagePath)], { type: "image/png" }), product.image);
      form.append(
        "request",
        JSON.stringify({
          idempotency_key: randomUUID(),
          object_id: savedItem.id,
          is_primary: true,
          image: {
            id: `#image-${product.id}`,
            type: "IMAGE",
            image_data: { name: product.name, caption: `${product.name} · 32 oz jar` },
          },
        }),
      );
      await squareRequest("/v2/catalog/images", { method: "POST", body: form });
    } catch (error) {
      console.error(`Image upload skipped for ${product.name}: ${error.message}`);
    }
  }
}

const deliverySku = "SOUL-BOWLS-DELIVERY-LA";
const existingDelivery = existingItems.find((item) =>
  item.item_data?.variations?.some(
    (variation) => variation.item_variation_data?.sku === deliverySku,
  ),
);
const existingDeliveryVariation = existingDelivery?.item_data?.variations?.find(
  (variation) => variation.item_variation_data?.sku === deliverySku,
);
const deliveryItemId = existingDelivery?.id ?? "#soul-bowls-delivery";
const deliveryVariationId =
  existingDeliveryVariation?.id ?? "#soul-bowls-delivery-la";
const deliveryBody = await upsertCatalogObject({
  type: "ITEM",
  id: deliveryItemId,
  ...(existingDelivery?.version ? { version: existingDelivery.version } : {}),
  present_at_all_locations: true,
  item_data: {
    name: "Soul Bowls™ LA County Delivery",
    description_html:
      "<p>Flat-rate delivery for one Soul Bowls™ order within Los Angeles County.</p>",
    product_type: "REGULAR",
    categories: [{ id: category.id }],
    reporting_category: { id: category.id },
    variations: [
      {
        type: "ITEM_VARIATION",
        id: deliveryVariationId,
        ...(existingDeliveryVariation?.version
          ? { version: existingDeliveryVariation.version }
          : {}),
        present_at_all_locations: true,
        item_variation_data: {
          item_id: deliveryItemId,
          name: "LA County order",
          sku: deliverySku,
          pricing_type: "FIXED_PRICING",
          price_money: { amount: 888, currency: "USD" },
          track_inventory: false,
          user_data: "soul-bowls:delivery-la",
        },
      },
    ],
  },
});
const savedDeliveryVariation = deliveryBody.catalog_object?.item_data?.variations?.[0];
if (!savedDeliveryVariation?.id) {
  throw new Error("Square did not return the Soul Bowls delivery variation ID");
}

const plan = catalogObjects.find(
  (object) =>
    object.type === "SUBSCRIPTION_PLAN" &&
    object.subscription_plan_data?.name === PLAN_NAME,
);
if (!plan?.id) throw new Error(`Square subscription plan not found: ${PLAN_NAME}`);
let planVariation = plan.subscription_plan_data?.subscription_plan_variations?.find(
  (variation) =>
    variation.subscription_plan_variation_data?.name === PLAN_VARIATION_NAME,
);
if (!planVariation) {
  const body = await upsertCatalogObject({
    type: "SUBSCRIPTION_PLAN_VARIATION",
    id: "#soul-bowls-itemized-weekly",
    present_at_all_locations: true,
    subscription_plan_variation_data: {
      name: PLAN_VARIATION_NAME,
      phases: [
        {
          cadence: "WEEKLY",
          ordinal: 0,
          pricing: { type: "RELATIVE" },
        },
      ],
      subscription_plan_id: plan.id,
    },
  });
  planVariation = body.catalog_object;
}
if (!planVariation?.id) throw new Error("Square did not return the itemized plan ID");

console.log(
  JSON.stringify(
    {
      categoryId: category.id,
      itemIds,
      environment: process.env.SQUARE_ENVIRONMENT ?? "sandbox",
      env: {
        ...variationIds,
        SQUARE_SOUL_BOWLS_DELIVERY_VARIATION_ID: savedDeliveryVariation.id,
        SQUARE_WEEKLY_ITEMIZED_PLAN_VARIATION_ID: planVariation.id,
      },
    },
    null,
    2,
  ),
);
