import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types.js";
import { apiFetch, type Tenant } from "$lib/api";

/**
 * Dashboard layout load function.
 *
 * - Guards unauthenticated users (redirect to /login)
 * - Fetches the user's tenants (now includes role per tenant)
 * - Resolves the active tenant from the `activeTenantId` cookie
 *   (set by the tenant switcher), falling back to the first tenant
 * - Exposes `userRole` for the active tenant so pages can gate UI by permission
 */
export const load: LayoutServerLoad = async ({ locals, request, cookies }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const cookieHeader = request.headers.get("cookie") ?? undefined;

  const tenantsRes = await apiFetch("/api/v1/tenants", {}, cookieHeader);
  const tenants: Tenant[] = tenantsRes.ok ? await tenantsRes.json() : [];

  // Read preferred tenant from cookie, fallback to first
  const savedTenantId = cookies.get("activeTenantId");
  let activeTenantId: number | null = null;
  let userRole: string | null = null;

  if (tenants.length > 0) {
    let activeTenant: Tenant | undefined;

    if (savedTenantId) {
      const parsed = Number(savedTenantId);
      // Validate it's actually a tenant the user belongs to
      activeTenant = tenants.find((t) => t.id === parsed);
      if (!activeTenant) {
        activeTenant = tenants[0];
      }
    } else {
      activeTenant = tenants[0];
    }

    activeTenantId = activeTenant.id;
    userRole = activeTenant.role ?? null;
  }

  return {
    user: locals.user,
    tenants,
    activeTenantId,
    userRole,
  };
};
