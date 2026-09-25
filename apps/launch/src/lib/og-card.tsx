/* eslint-disable @next/next/no-img-element -- ImageResponse (satori) renders plain <img> elements. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Shared branded share-card renderer for opengraph-image routes (1200×630, Marcellus, product photography). */
export const OG_SIZE = { width: 1200, height: 630 };

const asset = (name: string) => readFile(join(process.cwd(), "assets/og", name));
const dataUrl = async (name: string) => `data:image/${name.endsWith(".png") ? "png" : "jpeg"};base64,${(await asset(name)).toString("base64")}`;

export async function renderOgCard({
  headline,
  subline,
  main = "jar.jpg",
  side = "salad.jpg",
}: {
  headline: string;
  subline: string;
  main?: string;
  side?: string;
}) {
  const [marcellus, logo, mainImage, sideImage] = await Promise.all([asset("Marcellus-Regular.ttf"), dataUrl("logo.png"), dataUrl(main), dataUrl(side)]);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#F8F3EC", fontFamily: "Marcellus", color: "#2C3A34" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: "64px 0 64px 72px" }}>
          <img src={logo} width={300} height={104} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: headline.length > 40 ? 56 : 64, lineHeight: 1.04 }}>{headline}</div>
            <div style={{ marginTop: 28, fontSize: 26, color: "#5E6B65" }}>{subline}</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#93553D" }}>SOULGOOD.KITCHEN</div>
        </div>
        <div style={{ display: "flex", position: "relative", flex: 1 }}>
          <img src={mainImage} width={420} height={520} alt="" style={{ position: "absolute", top: 55, right: 60, borderRadius: 12, objectFit: "cover" }} />
          <img src={sideImage} width={300} height={214} alt="" style={{ position: "absolute", bottom: 40, left: 10, borderRadius: 12, objectFit: "cover", border: "8px solid #F8F3EC" }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Marcellus", data: marcellus, style: "normal", weight: 400 }] },
  );
}
