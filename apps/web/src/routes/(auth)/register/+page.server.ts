import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import type { ValidationError } from "$lib/api";

/** Redirect already-authenticated users away from the register page. */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(302, "/dashboard");
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const fullName = form.get("fullName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const passwordConfirmation = form.get("password_confirmation") as string;

    const cookieHeader = request.headers.get("cookie") ?? undefined;

    let response: Response;
    try {
      response = await apiFetch(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        },
        cookieHeader,
      );
    } catch {
      return fail(503, {
        fullName,
        email,
        error: "Could not connect to the server. Please try again.",
        field: undefined as string | undefined,
      });
    }

    if (response.ok || response.status === 201) {
      forwardCookies(response, cookies);
      redirect(302, "/dashboard");
    }

    if (response.status === 422) {
      const body = (await response.json()) as ValidationError;
      const firstError = body.errors?.[0];
      return fail(422, {
        fullName,
        email,
        error: firstError?.message ?? "Validation failed.",
        field: firstError?.field as string | undefined,
      });
    }

    return fail(response.status, {
      fullName,
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
 * DEV NOTE: sameSite is 'none' + secure:false for cross-origin local dev.
 * PROD NOTE: update to sameSite:'lax' + secure:true once on same origin + HTTPS.
 */
function forwardCookies(
  response: Response,
  cookies: import("@sveltejs/kit").Cookies,
): void {
  const setCookieHeaders: string[] =
    // @ts-ignore — getSetCookie is available in Node 18+ but absent in older TS lib defs
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : parseLegacySetCookie(response.headers.get("set-cookie") ?? "");

  for (const header of setCookieHeaders) {
    const [nameValue, ...attributes] = header.split(";").map((s) => s.trim());
    const eqIdx = nameValue.indexOf("=");
    if (eqIdx === -1) continue;

    const name = nameValue.slice(0, eqIdx);
    const value = nameValue.slice(eqIdx + 1);

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

function parseLegacySetCookie(raw: string): string[] {
  if (!raw) return [];
  return raw.split(/,(?=\s*\w+=)/);
}
