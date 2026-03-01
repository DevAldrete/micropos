import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import type { ValidationError, ApiError } from "$lib/api";

/** Redirect already-authenticated users away from the login page. */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(302, "/dashboard");
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const cookieHeader = request.headers.get("cookie") ?? undefined;

    let response: Response;
    try {
      response = await apiFetch(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        cookieHeader,
      );
    } catch {
      return fail(503, {
        email,
        error: "Could not connect to the server. Please try again.",
        field: undefined as string | undefined,
      });
    }

    if (response.ok) {
      try {
        console.log("Login OK, forwarding cookies...");
        forwardCookies(response, cookies);
      } catch (err) {
        console.error("Error forwarding cookies:", err);
      }
      redirect(302, "/dashboard");
    }

    if (response.status === 422) {
      const body = (await response.json()) as ValidationError;
      const firstError = body.errors?.[0];
      return fail(422, {
        email,
        error: firstError?.message ?? "Validation failed.",
        field: firstError?.field as string | undefined,
      });
    }

    if (response.status === 400) {
      const body = (await response.json()) as ApiError;
      return fail(400, {
        email,
        error: body.message ?? "Invalid email or password.",
        field: undefined as string | undefined,
      });
    }

    return fail(response.status, {
      email,
      error: "An unexpected error occurred. Please try again.",
      field: undefined as string | undefined,
    });
  },
};

/**
 * Forwards Set-Cookie headers from an AdonisJS API response to the browser
 * via SvelteKit's cookies API.
 *
 * This is necessary because form actions run server-side: the API response's
 * Set-Cookie headers reach SvelteKit's Node process, not the browser directly.
 * We parse each cookie and re-set it so the browser receives it.
 *
 * DEV NOTE: sameSite is set to 'none' and secure to false to match
 * apps/api/config/session.ts settings for cross-origin local dev.
 * PROD NOTE: update to sameSite:'lax'/secure:true once on same origin + HTTPS.
 */
function forwardCookies(
  response: Response,
  cookies: import("@sveltejs/kit").Cookies,
): void {
  // getSetCookie() returns each Set-Cookie header as a separate string (Node 18+).
  const setCookieHeaders: string[] =
    // @ts-ignore — getSetCookie is available in Node 18+ but not in older TS lib defs
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : parseLegacySetCookie(response.headers.get("set-cookie") ?? "");

  for (const header of setCookieHeaders) {
    const [nameValue, ...attributes] = header.split(";").map((s) => s.trim());
    const eqIdx = nameValue.indexOf("=");
    if (eqIdx === -1) continue;

    const name = nameValue.slice(0, eqIdx);
    const value = nameValue.slice(eqIdx + 1);

    // Parse optional attributes
    const attrMap: Record<string, string | boolean> = {};
    for (const attr of attributes) {
      const [k, v] = attr.split("=").map((s) => s.trim());
      attrMap[k.toLowerCase()] = v ?? true;
    }

    cookies.set(name, value, {
      path: (attrMap["path"] as string) ?? "/",
      httpOnly: "httponly" in attrMap,
      secure: false, // Must be true in production with HTTPS
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
