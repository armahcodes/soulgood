const ORIGIN = "https://www.soulgood.kitchen";

export function safeAccountRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || /[\\\u0000-\u0020]/.test(value))
    return "/account";
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("//") || /[\\\u0000-\u0020]/.test(decoded))
      return "/account";
    const url = new URL(value, ORIGIN);
    return url.origin === ORIGIN
      ? url.pathname + url.search + url.hash
      : "/account";
  } catch {
    return "/account";
  }
}
