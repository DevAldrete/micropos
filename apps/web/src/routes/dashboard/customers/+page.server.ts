import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { apiFetch, type Customer, type PaginatedResponse } from "$lib/api";

export const load: PageServerLoad = async ({
  locals,
  request,
  parent,
  url,
}) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const { tenants, activeTenantId } = await parent();
  const cookieHeader = request.headers.get("cookie") ?? undefined;

  if (!activeTenantId || tenants.length === 0) {
    return {
      tenants: [],
      customers: {
        data: [],
        meta: {
          total: 0,
          perPage: 20,
          currentPage: 1,
          lastPage: 1,
          firstPage: 1,
        },
      },
      activeTenantId: null,
    };
  }

  const page = url.searchParams.get("page") ?? "1";
  const perPage = url.searchParams.get("perPage") ?? "20";
  const search = url.searchParams.get("search") ?? "";

  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const customersRes = await apiFetch(
    `/api/v1/t/${activeTenantId}/customers?page=${page}&perPage=${perPage}${searchParam}`,
    {},
    cookieHeader,
  );

  const customers: PaginatedResponse<Customer> = customersRes.ok
    ? await customersRes.json()
    : {
        data: [],
        meta: {
          total: 0,
          perPage: 20,
          currentPage: 1,
          lastPage: 1,
          firstPage: 1,
        },
      };

  return {
    user: locals.user,
    tenants,
    activeTenantId,
    customers,
  };
};

export const actions: Actions = {
  createCustomer: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!name || !tenantId) {
      return fail(400, { error: "Name and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/customers`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
        }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: "Failed to create customer",
        details: err,
      });
    }

    return { success: true };
  },

  updateCustomer: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !name || !tenantId) {
      return fail(400, { error: "ID, name, and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/customers/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
        }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: "Failed to update customer",
        details: err,
      });
    }

    return { success: true };
  },

  deleteCustomer: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !tenantId)
      return fail(400, { error: "ID and tenant ID are required" });

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/customers/${id}`,
      { method: "DELETE" },
      cookieHeader,
    );

    if (!res.ok)
      return fail(res.status, { error: "Failed to delete customer" });
    return { success: true };
  },
};
