import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { apiFetch, type PaginatedResponse } from "$lib/api";

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
      orders: {
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

  // Fetch orders
  const ordersRes = await apiFetch(
    `/api/v1/t/${activeTenantId}/orders?page=${page}&perPage=${perPage}`,
    {},
    cookieHeader,
  );

  const orders: PaginatedResponse<any> = ordersRes.ok
    ? await ordersRes.json()
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
    orders,
  };
};
