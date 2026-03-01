import type { Handle } from "@sveltejs/kit";
import { apiFetch } from "$lib/api";
import type { AuthUser } from "./app.js";

export const handle: Handle = async ({ event, resolve }) => {
  if (process.env.DEBUG_WEB === "true") {
    console.log(`[WEB_REQ] ${event.request.method} ${event.url.pathname}`);
  }

  const cookieHeader = event.request.headers.get("cookie") ?? undefined;

  try {
    const response = await apiFetch("/auth/me", {}, cookieHeader);

    if (response.ok) {
      event.locals.user = (await response.json()) as AuthUser;
    } else {
      event.locals.user = null;
    }
  } catch (err) {
    if (process.env.DEBUG_WEB === "true") {
      console.error(`[WEB_ERR] Failed to fetch /auth/me:`, err);
    }
    event.locals.user = null;
  }

  const response = await resolve(event);

  if (process.env.DEBUG_WEB === "true") {
    console.log(
      `[WEB_RES] ${event.request.method} ${event.url.pathname} -> ${response.status}`,
    );
  }

  return response;
};
