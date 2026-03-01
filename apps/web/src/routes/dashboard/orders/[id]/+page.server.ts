import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({ locals, request, params }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const cookieHeader = request.headers.get("cookie") ?? undefined;

  const tenantsRes = await apiFetch("/api/v1/tenants", {}, cookieHeader);
  if (!tenantsRes.ok) {
    return { order: null };
  }

  const tenants = await tenantsRes.json();
  if (tenants.length === 0) {
    return { order: null };
  }

  const activeTenantId = tenants[0].id;
  const orderId = params.id;

  // Fetch single order
  const orderRes = await apiFetch(
    `/api/v1/t/${activeTenantId}/orders/${orderId}`,
    {},
    cookieHeader,
  );

  if (!orderRes.ok) {
    return { order: null };
  }

  const order = await orderRes.json();

  return {
    user: locals.user,
    order,
  };
};
