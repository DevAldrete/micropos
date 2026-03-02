import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { apiFetch, type TeamMember } from "$lib/api";

export const load: PageServerLoad = async ({ locals, request, parent }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  const { tenants, activeTenantId, userRole } = await parent();
  const cookieHeader = request.headers.get("cookie") ?? undefined;

  // Only owners can access team management
  if (userRole !== "owner") {
    redirect(302, "/dashboard");
  }

  if (!activeTenantId || tenants.length === 0) {
    return {
      tenants: [],
      members: [] as TeamMember[],
      activeTenantId: null,
      userRole,
    };
  }

  const membersRes = await apiFetch(
    `/api/v1/t/${activeTenantId}/team`,
    {},
    cookieHeader,
  );

  const members: TeamMember[] = membersRes.ok ? await membersRes.json() : [];

  return {
    user: locals.user,
    tenants,
    activeTenantId,
    userRole,
    members,
  };
};

export const actions: Actions = {
  invite: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const fullName = form.get("fullName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const passwordConfirmation = form.get("password_confirmation") as string;
    const role = form.get("role") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!fullName || !email || !password || !role || !tenantId) {
      return fail(400, { error: "All fields are required" });
    }

    if (password !== passwordConfirmation) {
      return fail(400, { error: "Passwords do not match" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/team/invite`,
      {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role,
        }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: err.message || "Failed to invite team member",
      });
    }

    return { success: true };
  },

  updateRole: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const role = form.get("role") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !role || !tenantId) {
      return fail(400, { error: "ID, role, and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/team/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ role }),
      },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: err.message || "Failed to update role",
      });
    }

    return { success: true };
  },

  removeMember: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const form = await request.formData();
    const id = form.get("id") as string;
    const tenantId = form.get("tenantId") as string;
    const cookieHeader = request.headers.get("cookie") ?? undefined;

    if (!id || !tenantId) {
      return fail(400, { error: "ID and tenant ID are required" });
    }

    const res = await apiFetch(
      `/api/v1/t/${tenantId}/team/${id}`,
      { method: "DELETE" },
      cookieHeader,
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return fail(res.status, {
        error: err.message || "Failed to remove team member",
      });
    }

    return { success: true };
  },
};
