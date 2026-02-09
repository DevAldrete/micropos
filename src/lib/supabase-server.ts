import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import type { Database } from "../../database.types";

export function createSupabaseServerClient(
	request: Request,
	cookies: AstroCookies,
) {
	return createServerClient<Database>(
		import.meta.env.PUBLIC_SUPABASE_URL,
		import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "").map(
						({ name, value }) => ({
							name,
							value: value ?? "",
						}),
					);
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						cookies.set(name, value, options);
					}
				},
			},
		},
	);
}
