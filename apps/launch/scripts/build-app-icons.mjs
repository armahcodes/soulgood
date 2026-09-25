#!/usr/bin/env node
/**
 * Builds favicon, Apple touch, and installable-app icons from the brand mark
 * (public/brand/soul-good-icon-cream.png) on a Forest Depth background.
 *
 *   node scripts/build-app-icons.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..");
const source = path.join(root, "public/brand/soul-good-icon-cream.png");
const FOREST = { r: 44, g: 58, b: 52, alpha: 1 };

async function icon(size, markRatio, out) {
  const markHeight = Math.round(size * markRatio);
  const mark = await sharp(source).resize({ height: markHeight }).toBuffer();
  await mkdir(path.dirname(out), { recursive: true });
  await sharp({ create: { width: size, height: size, channels: 4, background: FOREST } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("wrote", path.relative(root, out));
}

await icon(512, 0.62, path.join(root, "src/app/icon.png"));
await icon(180, 0.62, path.join(root, "src/app/apple-icon.png"));
await icon(192, 0.62, path.join(root, "public/icons/icon-192.png"));
await icon(512, 0.62, path.join(root, "public/icons/icon-512.png"));
// Maskable icons keep the mark inside the 80% safe zone.
await icon(512, 0.46, path.join(root, "public/icons/icon-maskable-512.png"));
