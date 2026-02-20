import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { apiFetch } from "$lib/api";

/**
 * POST /logout
 *
 * Calls the AdonisJS logout endpoint to destroy the server-side session,
 * then clears the session cookie in the browser and redirects to home.
 */
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    try {
      await apiFetch("/auth/logout", { method: "POST" }, cookieHeader);
    } catch {
      // Even if the API call fails, clear the cookie locally
      // so the user is not stuck in a broken state.
    }

    // Clear the session cookie in the browser.
    cookies.delete("adonis-session", { path: "/" });

    redirect(302, "/");
  },
};
