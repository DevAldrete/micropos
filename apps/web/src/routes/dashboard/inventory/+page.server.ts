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
    // Return empty state or handle error
    return { tenants: [], categories: [], products: [] };
  }

  const tenants = await tenantsRes.json();

  if (tenants.length === 0) {
    return { tenants: [], categories: [], products: [] };
  }

  // Pick the first tenant for now
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
  createCategory: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!name || !tenantId) {
      return fail(400, { error: "Name and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/categories`,
      {
        method: "POST",
        body: JSON.stringify({ name, description }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      return fail(res.status, { error: "Failed to create category" });
    }

    return { success: true };
  },

  updateCategory: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !name || !tenantId) {
      return fail(400, { error: "ID, name, and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name, description }),
      },
      cookieHeader,
    );

    if (!res.ok)
      return fail(res.status, { error: "Failed to update category" });
    return { success: true };
  },

  deleteCategory: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !tenantId)
      return fail(400, { error: "ID and tenant ID are required" });

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/categories/${id}`,
      { method: "DELETE" },
      cookieHeader,
    );

    if (!res.ok)
      return fail(res.status, { error: "Failed to delete category" });
    return { success: true };
  },

  createProduct: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const name = form.get("name") as string;
    const sku = form.get("sku") as string;
    const description = form.get("description") as string;
    const priceStr = form.get("price") as string;
    const stockStr = form.get("stock") as string;
    const categoryIdStr = form.get("categoryId") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!name || !priceStr || !tenantId) {
      return fail(400, { error: "Name, price, and tenant ID are required" });
    }

    const price = parseFloat(priceStr);
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : undefined;

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/products`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          sku: sku || undefined,
          description: description || undefined,
          price,
          stock,
          categoryId,
        }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json();
      return fail(res.status, {
        error: "Failed to create product",
        details: err,
      });
    }

    return { success: true };
  },

  updateProduct: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const name = form.get("name") as string;
    const sku = form.get("sku") as string;
    const description = form.get("description") as string;
    const priceStr = form.get("price") as string;
    const stockStr = form.get("stock") as string;
    const categoryIdStr = form.get("categoryId") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !name || !priceStr || !tenantId) {
      return fail(400, {
        error: "ID, name, price, and tenant ID are required",
      });
    }

    const price = parseFloat(priceStr);
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : undefined;

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/products/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          sku: sku || undefined,
          description: description || undefined,
          price,
          stock,
          categoryId: categoryId || null,
        }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json();
      return fail(res.status, {
        error: "Failed to update product",
        details: err,
      });
    }
    return { success: true };
  },

  deleteProduct: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !tenantId)
      return fail(400, { error: "ID and tenant ID are required" });

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/products/${id}`,
      { method: "DELETE" },
      cookieHeader,
    );

    if (!res.ok) return fail(res.status, { error: "Failed to delete product" });
    return { success: true };
  },
};
