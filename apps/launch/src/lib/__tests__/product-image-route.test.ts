import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@vercel/blob", () => ({ get }));
import { GET } from "@/app/api/product-image/[slug]/route";

function image(slug = "glow-bowl", headers = {}) {
  return GET(
    new NextRequest(`http://localhost/api/product-image/${slug}`, { headers }),
    { params: Promise.resolve({ slug }) },
  );
}
beforeEach(() => {
  get.mockReset();
});

describe("product image resilience", () => {
  it.each([
    "missing-bowl",
    "__proto__",
    "constructor",
    "toString",
    "../private",
  ])("rejects unknown slug %s before reading storage", async (slug) => {
    expect((await image(slug)).status).toBe(404);
    expect(get).not.toHaveBeenCalled();
  });
  it.each([null, { statusCode: 404 }, { statusCode: 200, stream: null }])(
    "uses the approved local photo when storage returns %j",
    async (result) => {
      get.mockResolvedValue(result);
      const response = await image();
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("/products/glow-bowl.webp");
      expect(response.headers.get("cache-control")).toBe("public, max-age=60");
    },
  );
  it("uses a local photo when storage fails without exposing the error", async () => {
    get.mockRejectedValue(new Error("Private storage credential error"));
    const response = await image("anti-inflammatory-bowl");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "/products/anti-inflammatory-bowl.webp",
    );
    expect(await response.text()).toBe("");
  });
  it("preserves successful storage responses and conditional caching", async () => {
    get.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("image"));
          controller.close();
        },
      }),
      blob: { contentType: "image/webp", size: 5, etag: '"test"' },
    });
    const response = await image();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/webp");
    expect(await response.text()).toBe("image");
    get.mockResolvedValue({ statusCode: 304, blob: { etag: '"test"' } });
    const cached = await image("glow-bowl", { "if-none-match": '"test"' });
    expect(cached.status).toBe(304);
    expect(cached.headers.get("etag")).toBe('"test"');
    expect(get).toHaveBeenLastCalledWith("products/web/glow-bowl.webp", {
      access: "private",
      ifNoneMatch: '"test"',
    });
  });
});
