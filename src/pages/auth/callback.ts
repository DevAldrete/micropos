import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const next = requestUrl.searchParams.get("next") || "/";

	if (code) {
		const supabase = createSupabaseServerClient(request, cookies);
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return redirect(next);
		}
	}

	return redirect("/auth/auth-code-error");
};
