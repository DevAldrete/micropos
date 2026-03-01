import { PUBLIC_API_URL } from "$env/static/public";
import type { AuthUser } from "../app.js";

// --------------------------------------------------------------------------
// Shared response types matching the AdonisJS API contract
// --------------------------------------------------------------------------

export type { AuthUser };

/** Shape of a VineJS validation error response (HTTP 422). */
export interface ValidationError {
  message: string;
  errors: Array<{
    message: string;
    rule: string;
    field: string;
  }>;
}

/** Shape of a generic API error response (e.g. 400, 401, 500). */
export interface ApiError {
  message: string;
}

export interface Tenant {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  tenantId: number;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  tenantId: number;
  categoryId: number | null;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  stock: number;
}

// --------------------------------------------------------------------------
// Core fetch wrapper
// --------------------------------------------------------------------------

/**
 * Thin wrapper around `fetch` that:
 * - Prefixes every path with the AdonisJS API base URL
 * - Always sends `credentials: 'include'` so the session cookie flows correctly
 *   for cross-origin requests (localhost:5173 → localhost:3333 in dev)
 * - Sets `Content-Type: application/json` and `Accept: application/json` by default
 *
 * Pass a `RequestInit` to override headers or the method.
 * Pass a `cookieHeader` string (from `event.request.headers.get('cookie')`) when
 * calling from server-side load functions / hooks so the request carries the
 * user's session cookie when running on the Node.js side (not the browser).
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
  cookieHeader?: string,
): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(init.headers as Record<string, string> | undefined),
  });

  // Forward the browser's Cookie header when called server-side.
  // On the server, `credentials: 'include'` has no effect — we must proxy the
  // cookie manually so AdonisJS sees the session.
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  return fetch(`${PUBLIC_API_URL}${path}`, {
    ...init,
    headers,
    // Required for the browser to send/receive cookies cross-origin.
    // Has no effect on Node.js (server-side) calls, hence the cookieHeader param above.
    credentials: "include",
  });
}
