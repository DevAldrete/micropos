import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch } from "$lib/api";

export const load: PageServerLoad = async ({
  locals,
  request,
  params,
  parent,
}) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const { tenants, activeTenantId } = await parent();
  const cookieHeader = request.headers.get("cookie") ?? undefined;

  if (!activeTenantId || tenants.length === 0) {
    return { order: null };
  }

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
