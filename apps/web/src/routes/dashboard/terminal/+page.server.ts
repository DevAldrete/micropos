import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { apiFetch, type Tenant, type Category, type Product } from "$lib/api";

export const load: PageServerLoad = async ({ locals, request }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const cookieHeader = request.headers.get("cookie") ?? undefined;

  // 1. Fetch tenants
  const tenantsRes = await apiFetch("/api/v1/tenants", {}, cookieHeader);
  if (!tenantsRes.ok) {
    return { tenants: [], categories: [], products: [] };
  }

  const tenants = await tenantsRes.json();

  if (tenants.length === 0) {
    return { tenants: [], categories: [], products: [] };
  }

  const activeTenantId = tenants[0].id;

  // 2. Fetch categories & products in parallel
  const [categoriesRes, productsRes] = await Promise.all([
    apiFetch(`/api/v1/t/${activeTenantId}/categories`, {}, cookieHeader),
    apiFetch(`/api/v1/t/${activeTenantId}/products`, {}, cookieHeader),
  ]);

  const categories: Category[] = categoriesRes.ok
    ? await categoriesRes.json()
    : [];
  const products: Product[] = productsRes.ok ? await productsRes.json() : [];

  return {
    user: locals.user,
    tenants,
    activeTenantId,
    categories,
    products,
  };
};

export const actions: Actions = {
  checkout: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const tenantId = form.get("tenantId") as string;
    const itemsJson = form.get("items") as string;
    const amountStr = form.get("amount") as string;
    const method = form.get("method") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!tenantId || !itemsJson || !amountStr || !method) {
      return fail(400, { error: "Missing required checkout fields" });
    }

    let items;
    try {
      items = JSON.parse(itemsJson);
    } catch (e) {
      return fail(400, { error: "Invalid items format" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return fail(400, { error: "Cart is empty" });
    }

    // 1. Create Order
    const orderRes = await apiFetch(
      `/api/v1/t/${tenantId}/orders`,
      {
        method: "POST",
        body: JSON.stringify({ items }),
      },
      cookieHeader,
    );

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      return fail(orderRes.status, {
        error: "Failed to create order",
        details: err,
      });
    }

    const order = await orderRes.json();

    // 2. Process Payment
    const paymentRes = await apiFetch(
      `/api/v1/t/${tenantId}/orders/${order.id}/pay`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: parseFloat(amountStr),
          method: method,
        }),
      },
      cookieHeader,
    );

    if (!paymentRes.ok) {
      const err = await paymentRes.json().catch(() => ({}));
      return fail(paymentRes.status, {
        error: "Order created but payment failed",
        details: err,
      });
    }

    return { success: true, orderId: order.id };
  },
};
