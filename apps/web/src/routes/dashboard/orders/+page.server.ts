import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals, request }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const cookieHeader = request.headers.get("cookie") ?? undefined;

  const tenantsRes = await apiFetch("/api/v1/tenants", {}, cookieHeader);
  if (!tenantsRes.ok) {
    return { tenants: [], orders: [] };
  }

  const tenants = await tenantsRes.json();
  if (tenants.length === 0) {
    return { tenants: [], orders: [] };
  }

  const activeTenantId = tenants[0].id;

  // Fetch orders
  const ordersRes = await apiFetch(
    `/api/v1/t/${activeTenantId}/orders`,
    {},
    cookieHeader,
  );

  const orders = ordersRes.ok ? await ordersRes.json() : [];

  return {
    user: locals.user,
    tenants,
    activeTenantId,
    orders,
  };
};
