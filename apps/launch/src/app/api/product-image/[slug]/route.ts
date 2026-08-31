import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PRODUCT_IMAGE_PATHS: Record<string, string> = {
  "glow-bowl": "products/web/glow-bowl.webp",
  "golden-harvest-bowl": "products/web/golden-harvest-bowl.webp",
  "jerk-wellness-bowl": "products/web/jerk-wellness-bowl.webp",
  "performance-power-bowl": "products/web/performance-power-bowl.webp",
  "herb-chicken-nourish-bowl": "products/web/herb-chicken-nourish-bowl.webp",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pathname = PRODUCT_IMAGE_PATHS[slug];

  if (!pathname) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });

    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    if (result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "image/webp",
        "Content-Length": String(result.blob.size),
        "X-Content-Type-Options": "nosniff",
        ETag: result.blob.etag,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Product image unavailable", { status: 503 });
  }
}
