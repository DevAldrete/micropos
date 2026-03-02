import { env } from "$env/dynamic/private";

/**
 * Forwards Set-Cookie headers from an AdonisJS API response to the browser
 * via SvelteKit's cookies API.
 *
 * This is necessary because form actions run server-side: the API response's
 * Set-Cookie headers reach SvelteKit's Node process, not the browser directly.
 * We parse each cookie and re-set it so the browser receives it.
 *
 * The `secure` flag is set based on NODE_ENV so that cookies work correctly
 * in both local development (HTTP) and production (HTTPS).
 */
export function forwardCookies(
  response: Response,
  cookies: import("@sveltejs/kit").Cookies,
): void {
  const isProduction = env.NODE_ENV === "production";

  // getSetCookie() returns each Set-Cookie header as a separate string.
  // Available in Node 18.14.1+ and all modern runtimes.
  const setCookieHeaders: string[] =
    "getSetCookie" in response.headers &&
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : parseLegacySetCookie(response.headers.get("set-cookie") ?? "");

  for (const header of setCookieHeaders) {
    const [nameValue, ...attributes] = header.split(";").map((s) => s.trim());
    const eqIdx = nameValue.indexOf("=");
    if (eqIdx === -1) continue;

    const name = nameValue.slice(0, eqIdx);
    const rawValue = nameValue.slice(eqIdx + 1);

    // The value from Adonis is already URL-encoded.
    // SvelteKit's cookies.set will automatically URL-encode the value again,
    // so we must decode it here to prevent double-encoding.
    const value = decodeURIComponent(rawValue);

    // Parse optional attributes
    const attrMap: Record<string, string | boolean> = {};
    for (const attr of attributes) {
      const [k, v] = attr.split("=").map((s) => s.trim());
      attrMap[k.toLowerCase()] = v ?? true;
    }

    cookies.set(name, value, {
      path: (attrMap["path"] as string) ?? "/",
      httpOnly: "httponly" in attrMap,
      secure: isProduction,
      sameSite: "lax",
      maxAge: attrMap["max-age"] ? Number(attrMap["max-age"]) : undefined,
    });
  }
}

/** Fallback parser for environments where getSetCookie() is not available. */
function parseLegacySetCookie(raw: string): string[] {
  if (!raw) return [];
  // Split on commas that precede a cookie name=value pattern.
  return raw.split(/,(?=\s*\w+=)/);
}
