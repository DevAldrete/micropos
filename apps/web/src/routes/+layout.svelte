<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import type { LayoutData } from "./$types";

	let { children, data }: { children: import("svelte").Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-gray-200 bg-white">
		<nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/" class="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
				MicroPOS
			</a>

			<div class="flex items-center gap-3">
				{#if data.user}
					<span class="text-sm text-gray-600">
						{data.user.fullName ?? data.user.email}
					</span>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
						>
							Sign out
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
					>
						Sign in
					</a>
					<a
						href="/register"
						class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
					>
						Get started
					</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
		&copy; {new Date().getFullYear()} MicroPOS
	</footer>
</div>
