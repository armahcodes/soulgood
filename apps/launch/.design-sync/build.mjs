// Generates Claude Design preview cards for the Soul Good launch design system.
// One shared token/base stylesheet -> consistent cards.
// Source of truth: src/app/globals.css + src/lib/brand.ts + src/components/**.
// Light "Brand Kit" theme: Soft Oat background, Forest Depth ink, Sage/Clay/Gold accents.
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = new URL("./dist/", import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });

// ---- Brand tokens (verbatim from globals.css / brand.ts) --------------------
const TOKENS = `:root{
  --sage:#77916F; --forest:#2C3A34; --clay:#C17A5E;
  --oat:#F8F3EC; --gold:#C9A161; --sand:#ECD6BC;
  --background:var(--oat); --foreground:var(--forest);
  /* alpha helpers used across components (forest/sage/clay on oat) */
  --forest-75:rgba(44,58,52,.75); --forest-70:rgba(44,58,52,.70); --forest-55:rgba(44,58,52,.55);
  --forest-40:rgba(44,58,52,.40); --forest-30:rgba(44,58,52,.30); --forest-20:rgba(44,58,52,.20);
  --forest-15:rgba(44,58,52,.15); --forest-10:rgba(44,58,52,.10);
  --sage-60:rgba(119,145,111,.60); --sage-20:rgba(119,145,111,.20); --sage-15:rgba(119,145,111,.15);
  --clay-25:rgba(193,122,94,.25); --clay-10:rgba(193,122,94,.10);
  --sand-50:rgba(236,214,188,.50); --white-70:rgba(255,255,255,.70);
  --radius-xl:16px; --radius-2xl:24px; --radius-3xl:32px; --radius-full:9999px;
  --font-serif:'EB Garamond',Georgia,'Times New Roman',serif;
  --font-sans:Arial,Helvetica,'Helvetica Neue',sans-serif;
}`;

// EB Garamond loaded from Google Fonts so headline cards render true-to-app.
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap');`;

// ---- Shared base CSS (approximates the Tailwind utility output) --------------
const BASE = `*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--background);color:var(--foreground);font-family:var(--font-sans);
  -webkit-font-smoothing:antialiased;padding:32px;line-height:1.5}
.wrap{display:flex;flex-direction:column;gap:24px;max-width:840px}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:14px}
.col{display:flex;flex-direction:column;gap:12px}
h1{font-family:var(--font-serif);font-size:30px;font-weight:500;letter-spacing:.01em;margin:0;color:var(--forest)}
h2,h3{font-family:var(--font-serif);font-weight:500;margin:0;color:var(--forest)}
.sub{color:var(--forest-70);font-size:14px;margin:-12px 0 6px;max-width:64ch}
.lbl{color:var(--forest-55);font-size:11px;text-transform:uppercase;letter-spacing:.10em;font-weight:600}
.eyebrow{color:var(--clay);font-size:12px;text-transform:uppercase;letter-spacing:.20em;font-weight:600}
.section{border-top:1px solid var(--forest-10);padding-top:20px}
.card{background:var(--white-70);border:1px solid var(--forest-15);border-radius:var(--radius-2xl);padding:24px}
/* ---- Button ---- */
.sgbtn{display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-full);
  font-family:var(--font-sans);font-weight:500;letter-spacing:.02em;cursor:pointer;border:1px solid transparent;
  transition:background-color .3s ease,color .3s ease;white-space:nowrap;text-decoration:none}
.sgbtn-primary{background:var(--forest);color:var(--oat)}
.sgbtn-primary:hover{background:var(--sage)}
.sgbtn-secondary{background:transparent;color:var(--forest);border-color:var(--forest)}
.sgbtn-secondary:hover{background:var(--forest);color:var(--oat)}
.sgbtn-link{background:transparent;color:var(--clay);text-decoration:underline;text-underline-offset:4px;
  text-decoration-thickness:1px;padding:0;font-size:16px}
.sgbtn-sm{min-height:44px;padding:10px 20px;font-size:14px}
.sgbtn-default{min-height:48px;padding:12px 32px;font-size:16px}
.sgbtn-lg{min-height:52px;padding:16px 40px;font-size:18px}
.sgbtn:disabled,.sgbtn[aria-disabled]{opacity:.5;pointer-events:none}
.sgbtn.full{width:100%}
/* ---- Option (quiz) ---- */
.opt{display:flex;width:100%;align-items:center;gap:12px;border-radius:var(--radius-2xl);border:1px solid var(--forest-15);
  background:var(--white-70);color:var(--forest);padding:16px 20px;text-align:left;font-size:16px;line-height:1.35;
  min-height:56px;transition:border-color .2s,background-color .2s;cursor:pointer;font-family:var(--font-sans)}
.opt:hover{border-color:var(--sage-60)}
.opt.selected{border-color:var(--sage);background:var(--sage-15)}
.opt.disabled{opacity:.4;cursor:not-allowed}
.opt .marker{margin-top:2px;display:flex;height:20px;width:20px;flex:0 0 auto;align-items:center;justify-content:center;
  border:2px solid var(--forest-30);background:transparent}
.opt .marker.radio{border-radius:var(--radius-full)}
.opt .marker.check{border-radius:6px}
.opt.selected .marker{border-color:var(--sage);background:var(--sage)}
.opt .dot{display:block;background:var(--oat)}
.opt .dot.radio{height:8px;width:8px;border-radius:var(--radius-full)}
.opt .dot.check{height:10px;width:10px;border-radius:2px}
/* ---- Inputs ---- */
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:14px;font-weight:500;color:var(--forest)}
.tinput{min-height:48px;border-radius:var(--radius-xl);border:1px solid var(--forest-20);background:var(--oat);
  padding:0 16px;font-size:16px;color:var(--forest);font-family:var(--font-sans);outline:none}
.tinput::placeholder{color:var(--forest-40)}
.tinput:focus{border-color:var(--sage);box-shadow:0 0 0 2px var(--sage-20)}
.tarea{min-height:96px;border-radius:var(--radius-2xl);border:1px solid var(--forest-15);background:var(--white-70);
  padding:16px 20px;font-size:16px;color:var(--forest);font-family:var(--font-sans);resize:none;outline:none}
.tarea:focus{border-color:var(--sage)}
.err{font-size:14px;color:var(--clay)}
/* ---- Badge / pill ---- */
.badge{display:inline-block;width:fit-content;border-radius:var(--radius-full);background:var(--sage-15);
  color:var(--sage);padding:6px 16px;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.16em}
`;

// Soul Good logo mark (verbatim viewBox/paths from components/ui/Logo.tsx).
const logo = (size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" style="color:${color};flex:0 0 auto">
    <circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="2"/>
    <path d="M24 9C16 16 16 32 24 39C32 32 32 16 24 9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M24 13V36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

function page(group, title, sub, bodyHtml) {
  return `<!-- @dsCard group="${group}" -->
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${FONTS}${TOKENS}${BASE}</style></head>
<body><div class="wrap"><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}${bodyHtml}</div></body></html>`;
}

const cards = [];
const add = (path, group, title, sub, body) => cards.push({ path, html: page(group, title, sub, body) });

// ============================ FOUNDATIONS ====================================
const swatch = (name, val, varname, kit, fg) =>
  `<div class="col" style="gap:6px"><div style="height:64px;border-radius:var(--radius-xl);background:${val};border:1px solid var(--forest-15);${fg ? "display:flex;align-items:flex-end;padding:8px;color:" + fg + ";font-family:var(--font-serif);font-size:18px" : ""}">${fg ? "Aa" : ""}</div>
  <div style="font-size:13px;font-weight:600">${name}</div><div style="font-size:11px;color:var(--forest-55)">${kit}</div><div style="font-size:11px;color:var(--forest-40);font-family:var(--font-sans)">${val} · ${varname}</div></div>`;

add("foundations/colors.html", "Foundations", "Color", "The Soul Good Brand Kit palette — warm, earthen, food-as-medicine. Soft Oat grounds every surface; Forest Depth is the ink; Sage, Clay & Gold carry intention.",
  `<div class="lbl">Brand Kit</div>
  <div class="row" style="gap:18px">
    ${swatch("Sage", "#77916F", "--sage", "Sage Ritual")}
    ${swatch("Forest", "#2C3A34", "--forest", "Forest Depth", "#F8F3EC")}
    ${swatch("Clay", "#C17A5E", "--clay", "Clay Essence")}
    ${swatch("Oat", "#F8F3EC", "--oat", "Soft Oat", "#2C3A34")}
    ${swatch("Gold", "#C9A161", "--gold", "Golden Harvest")}
    ${swatch("Sand", "#ECD6BC", "--sand", "Warm Sand", "#2C3A34")}
  </div>
  <div class="lbl section">Roles</div>
  <div class="col" style="gap:8px;font-size:14px;color:var(--forest-70)">
    <div><b style="color:var(--forest)">Background</b> — Soft Oat (#F8F3EC) on every page</div>
    <div><b style="color:var(--forest)">Ink / primary action</b> — Forest Depth (#2C3A34)</div>
    <div><b style="color:var(--forest)">Selection / progress / nature accent</b> — Sage Ritual (#77916F)</div>
    <div><b style="color:var(--forest)">Eyebrows, links & give-back</b> — Clay Essence (#C17A5E)</div>
    <div><b style="color:var(--forest)">Focus ring</b> — Golden Harvest (#C9A161)</div>
    <div><b style="color:var(--forest)">Soft toggle surfaces</b> — Warm Sand (#ECD6BC)</div>
  </div>`);

add("foundations/typography.html", "Foundations", "Typography", "Headlines in EB Garamond (serif, warm + editorial). Body & UI in the Arial system stack for crisp legibility at small sizes.",
  `<div class="col" style="gap:20px">
    <div><div class="lbl">Display — EB Garamond / var(--font-serif)</div>
      <div style="font-family:var(--font-serif);font-size:44px;font-weight:500;line-height:1.1;color:var(--forest)">Find your pathway</div></div>
    <div class="section"><div class="lbl">Heading 2</div>
      <div style="font-family:var(--font-serif);font-size:28px;font-weight:500;color:var(--forest)">Food as medicine, rooted in healing</div></div>
    <div class="section"><div class="lbl">Body — Arial / var(--font-sans)</div>
      <div style="font-size:16px;max-width:60ch;color:var(--forest-75)">Soul Good began with Chef Kyla&rsquo;s own healing journey — chef-made, soul-food-rooted meals crafted as nourishment, not just a menu. Body copy runs 16px at 1.5 line-height.</div>
      <div style="font-size:14px;color:var(--forest-55);margin-top:8px">Secondary body · 14px · forest/55</div></div>
    <div class="section"><div class="lbl">Eyebrow / tracked label</div>
      <div class="eyebrow">Your Soul Good pathway</div></div>
    <div class="section"><div class="lbl">Tagline lockup · tracking .22em</div>
      <div style="font-size:13px;font-weight:500;letter-spacing:.22em;color:var(--sage)">NOURISH &bull; HEAL &bull; THRIVE</div></div>
  </div>`);

add("foundations/logo.html", "Foundations", "Brand Mark", "Inline single-color mark — a seed/leaf vesica cradled in a ring (sacred-geometry + botanical). Uses currentColor, so it inherits text color and stays legible small.",
  `<div class="row" style="gap:40px;align-items:flex-end">
    <div class="col" style="align-items:center;gap:8px">${logo(64, "var(--forest)")}<span class="lbl">Forest · 64</span></div>
    <div class="col" style="align-items:center;gap:8px">${logo(52, "var(--sage)")}<span class="lbl">Sage · 52</span></div>
    <div class="col" style="align-items:center;gap:8px">${logo(40, "var(--clay)")}<span class="lbl">Clay · 40</span></div>
    <div class="col" style="align-items:center;gap:8px">${logo(24, "var(--forest)")}<span class="lbl">Forest · 24</span></div>
  </div>
  <div class="section row" style="gap:24px">
    <div style="background:var(--forest);border-radius:var(--radius-2xl);padding:24px;display:flex">${logo(48, "var(--oat)")}</div>
    <div style="background:var(--sage);border-radius:var(--radius-2xl);padding:24px;display:flex">${logo(48, "var(--oat)")}</div>
    <div style="background:var(--sand);border-radius:var(--radius-2xl);padding:24px;display:flex">${logo(48, "var(--forest)")}</div>
  </div>`);

add("foundations/radius.html", "Foundations", "Radius & Shape", "Soft, rounded forms throughout. Controls are fully-rounded pills; cards step up the radius scale.",
  `<div class="lbl">Radius scale</div>
  <div class="row" style="gap:20px">${[["xl","16px"],["2xl","24px"],["3xl","32px"],["full","pill"]].map(([n,v])=>`<div class="col" style="gap:8px;align-items:center"><div style="width:88px;height:64px;background:var(--sand);border:1px solid var(--forest-15);border-radius:${v==="pill"?"9999px":v}"></div><div style="font-size:12px;font-weight:600">${n}</div><div style="font-size:11px;color:var(--forest-55)">${v}</div></div>`).join("")}</div>
  <div class="lbl section">In use</div>
  <div class="row" style="gap:16px">
    <button class="sgbtn sgbtn-primary sgbtn-default">Pill button · full</button>
    <span class="badge">Pill badge</span>
    <div class="card" style="padding:16px 20px;font-size:14px;color:var(--forest-70)">Card · 2xl (24px)</div>
  </div>`);

// ============================ COMPONENTS =====================================
add("components/button.html", "Components", "Button", "3 variants × 3 sizes. Primary is Forest (hover → Sage); Secondary is an outline that fills on hover; Link is Clay underlined. Fully-rounded, ≥44px tall for thumb targets.",
  `<div class="lbl">Variants</div>
  <div class="row">
    <button class="sgbtn sgbtn-primary sgbtn-default">Reserve my spot</button>
    <button class="sgbtn sgbtn-secondary sgbtn-default">Join the list</button>
    <button class="sgbtn sgbtn-link">Take the quiz again</button>
  </div>
  <div class="lbl section">Sizes (primary)</div>
  <div class="row">
    <button class="sgbtn sgbtn-primary sgbtn-sm">Small · 44px</button>
    <button class="sgbtn sgbtn-primary sgbtn-default">Default · 48px</button>
    <button class="sgbtn sgbtn-primary sgbtn-lg">Large · 52px</button>
  </div>
  <div class="lbl section">Full-width · disabled</div>
  <div class="col" style="max-width:360px">
    <button class="sgbtn sgbtn-primary sgbtn-lg full">Become a Founding Member</button>
    <button class="sgbtn sgbtn-secondary sgbtn-default full">Share that you joined</button>
    <button class="sgbtn sgbtn-primary sgbtn-default full" disabled>Reserving…</button>
  </div>`);

add("components/option.html", "Components", "Quiz Option", "Large, thumb-friendly answer (≥56px). Left marker is a ring (single-select) or square (multi-select) that fills Sage when chosen. Selected tints the row Sage/15.",
  `<div class="lbl">Single-select (radio)</div>
  <div class="col" style="max-width:460px;gap:12px">
    <button class="opt selected"><span class="marker radio"><span class="dot radio"></span></span><span>Calm and steady</span></button>
    <button class="opt"><span class="marker radio"></span><span>I need more stamina and lasting energy</span></button>
    <button class="opt"><span class="marker radio"></span><span>Heavy, sluggish, or drained</span></button>
  </div>
  <div class="lbl section">Multi-select (checkbox) · cap reached</div>
  <div class="col" style="max-width:460px;gap:12px">
    <button class="opt selected"><span class="marker check"><span class="dot check"></span></span><span>Flavor</span></button>
    <button class="opt selected"><span class="marker check"><span class="dot check"></span></span><span>Energy</span></button>
    <button class="opt disabled"><span class="marker check"></span><span>Better Sleep</span></button>
  </div>`);

add("components/progress.html", "Components", "Quiz Progress", "Slim Sage progress bar with a “Step X of Y” caption — the quiz header. Track is forest/10; fill animates in Sage.",
  `<div class="col" style="max-width:460px;gap:24px">
    ${[ ["Step 1 of 11", 9], ["Step 4 of 11", 36], ["Step 8 of 11", 73], ["Step 11 of 11", 100] ].map(([label,pct])=>`
    <div class="col" style="gap:8px">
      <div style="height:6px;width:100%;overflow:hidden;border-radius:var(--radius-full);background:var(--forest-10)">
        <div style="height:100%;border-radius:var(--radius-full);background:var(--sage);width:${pct}%"></div>
      </div>
      <div style="font-size:12px;color:var(--forest-55)">${label}</div>
    </div>`).join("")}
  </div>`);

add("components/question-step.html", "Components", "Question Step", "One quiz question: serif prompt, optional Clay helper line, then options (single advances on tap) or a free-text reflection. Prompts & labels render verbatim from the Pathway Finder.",
  `<div class="row" style="align-items:flex-start;gap:32px">
    <div class="col" style="max-width:400px;gap:16px">
      <div class="col" style="gap:8px">
        <h2 style="font-size:24px;line-height:1.2">What matters most when choosing meals?</h2>
        <div style="font-size:14px;color:var(--clay)">Choose up to three.</div>
      </div>
      <div class="col" style="gap:12px">
        <button class="opt selected"><span class="marker check"><span class="dot check"></span></span><span>Flavor</span></button>
        <button class="opt"><span class="marker check"></span><span>Convenience</span></button>
        <button class="opt"><span class="marker check"></span><span>Digestive Health</span></button>
      </div>
    </div>
    <div class="col" style="max-width:360px;gap:16px">
      <div class="col" style="gap:8px"><h2 style="font-size:24px;line-height:1.2">Right now, my soul needs more:</h2></div>
      <textarea class="tarea" placeholder="Optional — share a few words"></textarea>
    </div>
  </div>`);

add("components/result-screen.html", "Components", "Result Screen", "The quiz payoff: brand mark, Clay eyebrow, the matched pathway name in large serif, its three-word descriptor in Sage, supporting line, and the forward CTA to /join.",
  `<div class="card" style="max-width:440px;align-items:center;text-align:center;display:flex;flex-direction:column;gap:24px;padding:36px">
    ${logo(52, "var(--sage)")}
    <div class="col" style="gap:10px;align-items:center">
      <div class="eyebrow">Your Soul Good pathway</div>
      <div style="font-family:var(--font-serif);font-size:40px;font-weight:500;line-height:1.1;color:var(--forest)">Detox</div>
      <div style="font-size:18px;font-weight:500;color:var(--sage)">Release. Restore. Renew.</div>
    </div>
    <p style="max-width:34ch;font-size:16px;line-height:1.5;color:var(--forest-75);margin:0">For those seeking hydration, digestive support, lighter nourishment, and a fresh start.</p>
    <button class="sgbtn sgbtn-primary sgbtn-lg full" style="max-width:320px">Become a Founding Member</button>
  </div>`);

add("components/signup-form.html", "Components", "Signup Form", "Founding-member capture: a Subscription/One-time segmented toggle (selected fills Forest) on a Warm Sand track, email + phone fields, and the dual reserve / join-the-list CTAs.",
  `<form class="card" style="max-width:420px;display:flex;flex-direction:column;gap:22px">
    <fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
      <legend class="eyebrow" style="letter-spacing:.16em;padding:0">Choose your plan</legend>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;border-radius:var(--radius-2xl);background:var(--sand-50);padding:6px">
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;border-radius:var(--radius-xl);background:var(--forest);color:var(--oat);padding:8px">
          <span style="font-size:14px;font-weight:500">Subscription</span><span style="font-size:12px;color:rgba(248,243,236,.75)">Auto-renews weekly</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;border-radius:var(--radius-xl);color:var(--forest-70);padding:8px">
          <span style="font-size:14px;font-weight:500">One-time</span><span style="font-size:12px;color:var(--forest-55)">Just this week</span>
        </div>
      </div>
    </fieldset>
    <div class="field"><label>Email</label><input class="tinput" placeholder="you@example.com"></div>
    <div class="field"><label>Phone</label><input class="tinput" placeholder="(310) 555-0134"></div>
    <div class="col" style="gap:12px">
      <button class="sgbtn sgbtn-primary sgbtn-lg full">Reserve my founding spot</button>
      <button class="sgbtn sgbtn-secondary sgbtn-default full">Join the list with your pathway</button>
    </div>
  </form>`);

add("components/inputs.html", "Components", "Inputs", "Text field, focus ring (Sage), invalid (Clay message) and the multiline reflection textarea. Fields sit on Oat with a forest/20 border; controls stay ≥48px.",
  `<div class="row" style="align-items:flex-start;gap:40px">
    <div class="col" style="max-width:300px;gap:18px">
      <div class="field"><label>Default</label><input class="tinput" placeholder="you@example.com"></div>
      <div class="field"><label>Focused</label><input class="tinput" value="kyla@soulgood.kitchen" style="border-color:var(--sage);box-shadow:0 0 0 2px var(--sage-20)"></div>
      <div class="field"><label>Invalid</label><input class="tinput" value="not-an-email" style="border-color:var(--clay)"><span class="err">Enter a valid email</span></div>
    </div>
    <div class="col" style="max-width:320px;gap:8px">
      <span class="lbl">Reflection textarea</span>
      <textarea class="tarea">I noticed I felt calmer and lighter after eating with intention this week.</textarea>
    </div>
  </div>`);

add("components/badge.html", "Components", "Pathway Badge", "Small uppercase pill that surfaces a returning guest's matched pathway on the welcome moment. Sage/15 fill, Sage text, wide tracking.",
  `<div class="row" style="gap:14px">
    <span class="badge">Your pathway · Mindful</span>
    <span class="badge">Your pathway · Performance</span>
    <span class="badge">Your pathway · Detox</span>
    <span class="badge">Your pathway · Alignment</span>
  </div>`);

add("components/brand-footer.html", "Components", "Brand Footer", "Shared sign-off across the capture flow: the canonical tagline in tracked Sage over a Chef Kyla credit. Strings come from lib/brand.ts — never hardcoded.",
  `<div class="card" style="max-width:420px;align-items:center;text-align:center;display:flex;flex-direction:column;gap:6px">
    <div style="font-size:12px;font-weight:500;letter-spacing:.22em;color:var(--sage)">NOURISH &bull; HEAL &bull; THRIVE</div>
    <div style="font-size:12px;letter-spacing:.02em;color:var(--forest-55)">Crafted with care by Chef Kyla</div>
  </div>`);

// ============================ PATTERNS =======================================
const PATHWAYS = [
  ["Mindful", "Grounded. Present. Nourishing.", "For intentional eating, everyday wellness, and nourishment without overthinking."],
  ["Performance", "Strength. Focus. Momentum.", "For active lifestyles, busy schedules, recovery, and sustained energy."],
  ["Detox", "Release. Restore. Renew.", "For those seeking hydration, digestive support, lighter nourishment, and a fresh start."],
  ["Alignment", "Balance. Harmony. Personalization.", "For those seeking nourishment aligned with their goals, values, and lifestyle."],
];

add("patterns/pathways.html", "Patterns", "Four Pathways", "The four Soul Good pathways with their three-word descriptors and supporting lines — the spine of the brand, shown as the landing-page trust slice.",
  `<div class="col" style="max-width:480px;gap:12px">
    ${PATHWAYS.map(([name,desc,body])=>`
    <div style="display:flex;flex-direction:column;gap:4px;border-radius:var(--radius-2xl);border:1px solid var(--sage-20);background:rgba(248,243,236,.70);padding:20px;text-align:left">
      <div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px">
        <span style="font-family:var(--font-serif);font-size:19px;font-weight:500;color:var(--forest)">${name}</span>
        <span style="font-size:14px;font-weight:500;letter-spacing:.04em;color:var(--sage)">${desc}</span>
      </div>
      <p style="font-size:14px;line-height:1.5;color:var(--forest-70);margin:0">${body}</p>
    </div>`).join("")}
  </div>`);

add("patterns/give-back.html", "Patterns", "Community Give-Back", "The give-back slice — every plan donates one meal a week. Clay-tinted card with the brand mark; reinforces the community-rooted, food-as-medicine positioning.",
  `<div style="max-width:460px;display:flex;flex-direction:column;gap:12px;border-radius:var(--radius-3xl);border:1px solid var(--clay-25);background:var(--clay-10);padding:28px;text-align:left">
    <div style="display:flex;align-items:center;gap:10px">${logo(22, "var(--clay)")}<h2 style="font-size:21px">Nourishment that reaches further</h2></div>
    <p style="font-size:14px;line-height:1.5;color:var(--forest-75);margin:0">Every plan donates <b style="color:var(--forest)">1 meal each week</b> to someone in the community. Eating well with Soul Good feeds your table and your neighbor&rsquo;s.</p>
  </div>`);

add("patterns/landing-hero.html", "Patterns", "Landing Hero", "Above-the-fold QR target: brand mark + tagline, serif headline, subhead, and the primary path into the Pathway Finder quiz.",
  `<div style="max-width:520px;background:var(--white-70);border:1px solid var(--forest-15);border-radius:var(--radius-3xl);padding:40px;display:flex;flex-direction:column;gap:20px;align-items:flex-start">
    <div style="display:flex;align-items:center;gap:12px">${logo(40, "var(--forest)")}<span style="font-size:12px;font-weight:500;letter-spacing:.22em;color:var(--sage)">NOURISH &bull; HEAL &bull; THRIVE</span></div>
    <h2 style="font-size:38px;line-height:1.1">Find the way you&rsquo;re meant to eat</h2>
    <p style="font-size:16px;line-height:1.5;color:var(--forest-75);margin:0;max-width:42ch">Take the 2-minute Pathway Finder and discover your Soul Good pathway — then claim one of fifty founding-member spots.</p>
    <div class="row" style="gap:12px">
      <button class="sgbtn sgbtn-primary sgbtn-lg">Find your pathway</button>
      <button class="sgbtn sgbtn-link">How it works</button>
    </div>
  </div>`);

// ---- emit -------------------------------------------------------------------
for (const c of cards) {
  const full = join(OUT, c.path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, c.html);
}
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "tokens.css"), FONTS + "\n" + TOKENS + "\n");
writeFileSync(join(OUT, "README.md"),
  `# Soul Good — Design System\n\nSynced from the \`launch\` app (Next.js). The Brand Kit is the source of truth in \`src/lib/brand.ts\` + \`src/app/globals.css\`; cards are static previews for claude.ai/design.\n\nLight theme: Soft Oat background, Forest Depth ink, Sage / Clay / Gold / Sand accents. Headlines EB Garamond, body Arial.\n`);

console.log(`Wrote ${cards.length} cards + tokens.css + README.md to dist/`);
console.log(cards.map(c => "  " + c.path).join("\n"));
