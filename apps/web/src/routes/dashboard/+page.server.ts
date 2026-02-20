import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/**
 * Guard: redirect unauthenticated users to the login page.
 * The user is populated by hooks.server.ts on every request.
 */
export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) {
    redirect(302, "/login");
  }

  return {
    user: locals.user,
  };
};
