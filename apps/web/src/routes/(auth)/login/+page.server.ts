import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import type { ValidationError, ApiError } from "$lib/api";
import { forwardCookies } from "$lib/cookies";

/** Redirect already-authenticated users away from the login page. */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(302, "/dashboard");
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const cookieHeader = request.headers.get("cookie") ?? undefined;

    let response: Response;
    try {
      response = await apiFetch(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        cookieHeader,
      );
    } catch {
      return fail(503, {
        email,
        error: "Could not connect to the server. Please try again.",
        field: undefined as string | undefined,
      });
    }

    if (response.ok) {
      try {
        forwardCookies(response, cookies);
      } catch (err) {
        console.error("Error forwarding cookies:", err);
      }
      redirect(302, "/dashboard");
    }

    if (response.status === 422) {
      const body = (await response.json()) as ValidationError;
      const firstError = body.errors?.[0];
      return fail(422, {
        email,
        error: firstError?.message ?? "Validation failed.",
        field: firstError?.field as string | undefined,
      });
    }

    if (response.status === 400) {
      const body = (await response.json()) as ApiError;
      return fail(400, {
        email,
        error: body.message ?? "Invalid email or password.",
        field: undefined as string | undefined,
      });
    }

    return fail(response.status, {
      email,
      error: "An unexpected error occurred. Please try again.",
      field: undefined as string | undefined,
    });
  },
};
