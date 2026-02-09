import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../../database.types";

export function createClient() {
	return createBrowserClient<Database>(
		import.meta.env.PUBLIC_SUPABASE_URL,
		import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	);
}
