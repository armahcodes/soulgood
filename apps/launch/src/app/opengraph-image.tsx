import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Soul Good: chef-made Soul Bowls™, salads, and sides, delivered Sundays across Los Angeles and Orange County";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (name: string) => readFile(join(process.cwd(), "assets/og", name));
const dataUrl = async (name: string, type: string) => `data:${type};base64,${(await asset(name)).toString("base64")}`;

/** Branded share card: logo, headline in Marcellus (the wordmark's closest match), and product photography. */
export default async function OpenGraphImage() {
  const [marcellus, logo, jar, salad] = await Promise.all([
    asset("Marcellus-Regular.ttf"),
    dataUrl("logo.png", "image/png"),
    dataUrl("jar.jpg", "image/jpeg"),
    dataUrl("salad.jpg", "image/jpeg"),
  ]);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#F8F3EC", fontFamily: "Marcellus", color: "#2C3A34" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: "64px 0 64px 72px" }}>
          <img src={logo} width={300} height={104} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, lineHeight: 1.04 }}>Chef-made nourishment, ready when you are.</div>
            <div style={{ marginTop: 28, fontSize: 26, color: "#5E6B65" }}>Soul Bowls™, salads & sides · Sundays across LA & Orange County</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#C17A5E" }}>SOULGOOD.KITCHEN</div>
        </div>
        <div style={{ display: "flex", position: "relative", flex: 1 }}>
          <img src={jar} width={420} height={520} alt="" style={{ position: "absolute", top: 55, right: 60, borderRadius: 12, objectFit: "cover" }} />
          <img src={salad} width={300} height={214} alt="" style={{ position: "absolute", bottom: 40, left: 10, borderRadius: 12, objectFit: "cover", border: "8px solid #F8F3EC" }} />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Marcellus", data: marcellus, style: "normal", weight: 400 }] },
  );
}
