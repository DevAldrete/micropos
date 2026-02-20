import type { Handle } from "@sveltejs/kit";
import { apiFetch } from "$lib/api";
import type { AuthUser } from "./app.js";

/**
 * SvelteKit server hook — runs on every incoming request before any load function.
 *
 * Calls GET /auth/me on the AdonisJS API, forwarding the browser's Cookie header
 * so AdonisJS can validate the session. The result is stored in `event.locals.user`
 * which is then available to all +layout.server.ts and +page.server.ts load functions.
 *
 * Why we proxy the cookie manually:
 *   When SvelteKit runs on Node.js (server-side), `credentials: 'include'` in fetch
 *   has no effect — it only tells the *browser* to attach cookies. We must explicitly
 *   read the incoming Cookie header and forward it to the API ourselves.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const cookieHeader = event.request.headers.get("cookie") ?? undefined;

  try {
    const response = await apiFetch("/auth/me", {}, cookieHeader);

    if (response.ok) {
      event.locals.user = (await response.json()) as AuthUser;
    } else {
      event.locals.user = null;
    }
  } catch {
    // API is unreachable (e.g. during build or if the server is down).
    // Treat as unauthenticated rather than crashing the app.
    event.locals.user = null;
  }

  return resolve(event);
};
