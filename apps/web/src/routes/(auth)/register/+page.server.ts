import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { apiFetch } from "$lib/api";
import type { ValidationError } from "$lib/api";
import { forwardCookies } from "$lib/cookies";

/** Redirect already-authenticated users away from the register page. */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(302, "/dashboard");
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const fullName = form.get("fullName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const passwordConfirmation = form.get("password_confirmation") as string;

    const cookieHeader = request.headers.get("cookie") ?? undefined;

    let response: Response;
    try {
      response = await apiFetch(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        },
        cookieHeader,
      );
    } catch {
      return fail(503, {
        fullName,
        email,
        error: "Could not connect to the server. Please try again.",
        field: undefined as string | undefined,
      });
    }

    if (response.ok || response.status === 201) {
      forwardCookies(response, cookies);
      redirect(302, "/dashboard");
    }

    if (response.status === 422) {
      const body = (await response.json()) as ValidationError;
      const firstError = body.errors?.[0];
      return fail(422, {
        fullName,
        email,
        error: firstError?.message ?? "Validation failed.",
        field: firstError?.field as string | undefined,
      });
    }

    return fail(response.status, {
      fullName,
      email,
      error: "An unexpected error occurred. Please try again.",
      field: undefined as string | undefined,
    });
  },
};
