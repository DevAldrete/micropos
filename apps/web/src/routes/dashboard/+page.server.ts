import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch } from "$lib/api";

/**
 * Dashboard overview page.
 *
 * Tenants and activeTenantId come from the parent dashboard layout.
 */
export const load: PageServerLoad = async ({ locals, request, parent }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const { tenants, activeTenantId } = await parent();
  const cookieHeader = request.headers.get("cookie") ?? undefined;

  if (!activeTenantId || tenants.length === 0) {
    return {
      user: locals.user,
      tenants: [],
      stats: {
        grossVolume: 0,
        totalOrders: 0,
        activeInventory: 0,
        lowStock: 0,
      },
      recentTransactions: [],
    };
  }

  // Fetch orders and products in parallel
  // Orders endpoint always returns paginated response now.
  // For the dashboard overview we request a large page to get recent stats.
  // Products without ?page= returns a plain array.
  const [ordersRes, productsRes] = await Promise.all([
    apiFetch(
      `/api/v1/t/${activeTenantId}/orders?page=1&perPage=100`,
      {},
      cookieHeader,
    ),
    apiFetch(`/api/v1/t/${activeTenantId}/products`, {}, cookieHeader),
  ]);

  const ordersJson = ordersRes.ok
    ? await ordersRes.json()
    : { data: [], meta: { total: 0 } };
  const orders = ordersJson.data ?? [];
  const products = productsRes.ok ? await productsRes.json() : [];

  // Compute stats
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const grossVolume = completedOrders.reduce(
    (sum: number, o: any) => sum + Number(o.total),
    0,
  );
  const totalOrders = ordersJson.meta?.total ?? orders.length;

  const activeInventory = products.reduce(
    (sum: number, p: any) => sum + p.stock,
    0,
  );
  const lowStock = products.filter((p: any) => p.stock < 10).length;

  // Recent transactions (top 5)
  const recentTransactions = [...orders]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((o: any) => ({
      id: `TX-${o.id.toString().padStart(4, "0")}`,
      rawId: o.id,
      amount: `$${Number(o.total).toFixed(2)}`,
      status: o.status === "completed" ? "COMPLETED" : o.status.toUpperCase(),
      time: new Date(o.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  return {
    user: locals.user,
    tenants,
    stats: {
      grossVolume,
      totalOrders,
      activeInventory,
      lowStock,
    },
    recentTransactions,
  };
};
