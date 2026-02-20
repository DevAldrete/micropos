import type { LayoutServerLoad } from "./$types";

/**
 * Root layout load function — exposes the authenticated user (or null) to every
 * page in the app via `data.user`.
 *
 * The user is populated by hooks.server.ts on every request, so this is just
 * a pass-through from Locals → PageData.
 */
export const load: LayoutServerLoad = ({ locals }) => {
  return {
    user: locals.user,
  };
};
