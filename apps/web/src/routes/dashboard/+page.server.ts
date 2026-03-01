import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch } from "$lib/api";

/**
 * Guard: redirect unauthenticated users to the login page.
 * The user is populated by hooks.server.ts on every request.
 */
export const load: PageServerLoad = async ({ locals, request }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const cookieHeader = request.headers.get("cookie") ?? undefined;

  // 1. Fetch tenants
  const tenantsRes = await apiFetch("/api/v1/tenants", {}, cookieHeader);
  let tenants = [];
  if (tenantsRes.ok) {
    tenants = await tenantsRes.json();
  }

  if (tenants.length === 0) {
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

  const activeTenantId = tenants[0].id;

  // 2. Fetch orders and products in parallel
  const [ordersRes, productsRes] = await Promise.all([
    apiFetch(`/api/v1/t/${activeTenantId}/orders`, {}, cookieHeader),
    apiFetch(`/api/v1/t/${activeTenantId}/products`, {}, cookieHeader),
  ]);

  const orders = ordersRes.ok ? await ordersRes.json() : [];
  const products = productsRes.ok ? await productsRes.json() : [];

  // Compute stats
  // Gross volume is the sum of totals for completed orders
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const grossVolume = completedOrders.reduce(
    (sum: number, o: any) => sum + Number(o.total),
    0,
  );
  const totalOrders = orders.length;

  // Inventory metrics
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
