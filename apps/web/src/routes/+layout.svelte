<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import type { LayoutData } from "./$types";

	let { children, data }: { children: import("svelte").Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col font-sans bg-[var(--color-surface)] text-[var(--color-ink)] selection:bg-[var(--color-brand)] selection:text-white">
	<div class="ticker-wrap w-full flex overflow-hidden whitespace-nowrap bg-black text-white py-1.5 font-mono text-xs uppercase tracking-widest border-b-2 border-black">
		<div class="ticker flex gap-8">
			<span>NO COST. NO CATCH. COMPLETELY FREE.</span>
			<span>REAL-TIME COLLABORATION.</span>
			<span>MULTI-TENANT STORES.</span>
			<span>INVENTORY MANAGEMENT.</span>
			<span>PAYMENTS & BILLING.</span>
			<span>NO COST. NO CATCH. COMPLETELY FREE.</span>
			<span>REAL-TIME COLLABORATION.</span>
			<span>MULTI-TENANT STORES.</span>
			<span>INVENTORY MANAGEMENT.</span>
			<span>PAYMENTS & BILLING.</span>
		</div>
	</div>
	<header class="border-b-2 border-black bg-[var(--color-surface)] sticky top-0 z-50">
		<nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="text-2xl font-black font-display uppercase tracking-tight flex items-center gap-2 hover:text-[var(--color-brand)] transition-colors">
				<div class="w-4 h-4 bg-[var(--color-brand)]"></div>
				MicroPOS<span class="text-[var(--color-brand)]">.</span>
			</a>

			<div class="flex items-center gap-4 font-mono text-sm font-bold uppercase">
				{#if data.user}
					<span class="hidden md:inline-block border-2 border-black px-3 py-1 bg-white brutal-shadow">
						{data.user.fullName ?? data.user.email}
					</span>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="px-4 py-2 hover:text-[var(--color-brand)] transition-colors underline decoration-2 underline-offset-4"
						>
							Sign out
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="px-4 py-2 hover:text-[var(--color-brand)] transition-colors underline decoration-2 underline-offset-4"
					>
						Sign in
					</a>
					<a
						href="/register"
						class="border-2 border-black bg-[var(--color-brand)] px-6 py-2 text-white brutal-shadow hover:bg-black transition-colors"
					>
						Get started
					</a>
				{/if}
			</div>
		</nav>
	</header>

	<main class="flex-1 flex flex-col relative grid-bg">
		{@render children()}
	</main>

	<footer class="border-t-2 border-black bg-white px-6 py-12 text-center text-sm font-mono uppercase font-bold">
		<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
			<div class="flex items-center gap-2 text-lg font-black font-display tracking-tight">
				<div class="w-3 h-3 bg-black"></div>
				MicroPOS<span class="text-[var(--color-brand)]">.</span>
			</div>
			<div class="text-black">
				&copy; {new Date().getFullYear()} MICROPOS INC. ALL RIGHTS RESERVED.
			</div>
		</div>
	</footer>
</div>
