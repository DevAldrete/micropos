<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-[var(--color-surface)]">
	<!-- Global Top Navigation -->
	<nav class="bg-black text-white border-b-4 border-black sticky top-0 z-50 brutal-shadow">
		<div class="mx-auto max-w-[1400px] px-4 md:px-8 h-16 flex items-center justify-between">
			<!-- Logo / Brand -->
			<div class="flex items-center gap-6">
				<a href="/dashboard" class="font-display font-black text-2xl tracking-tighter uppercase flex items-center gap-2 hover:text-[var(--color-brand)] transition-colors">
					<span class="w-4 h-4 bg-[var(--color-brand)] inline-block"></span>
					Micro<span class="text-[var(--color-brand)]">POS</span>
				</a>
				
				<!-- Nav Links -->
				<div class="hidden md:flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-widest">
					<div class="w-0.5 h-6 bg-gray-800 mx-2"></div>
					<a 
						href="/dashboard" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors { $page.url.pathname === '/dashboard' ? 'bg-[var(--color-brand)]' : '' }"
					>
						Overview
					</a>
					<a 
						href="/dashboard/inventory" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors { $page.url.pathname.startsWith('/dashboard/inventory') ? 'bg-[var(--color-brand)]' : '' }"
					>
						Inventory
					</a>
					<a 
						href="/dashboard/terminal" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors { $page.url.pathname.startsWith('/dashboard/terminal') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white' }"
					>
						Terminal
					</a>
					<a 
						href="/dashboard/orders" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors { $page.url.pathname.startsWith('/dashboard/orders') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white' }"
					>
						Ledger
					</a>
				</div>
			</div>

			<!-- User / System Status -->
			<div class="flex items-center gap-4 font-mono text-xs font-bold uppercase">
				<div class="hidden md:flex items-center gap-2 text-green-500 border border-green-500 px-2 py-1 bg-green-500/10">
					<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
					SYS.ONLINE
				</div>
				<form method="POST" action="/logout">
					<button type="submit" class="hover:text-[var(--color-brand)] underline decoration-2 underline-offset-4 transition-colors">
						[TERMINATE_SESSION]
					</button>
				</form>
			</div>
		</div>
	</nav>

	<!-- Mobile Nav (Visible only on small screens) -->
	<div class="md:hidden bg-white border-b-2 border-black flex overflow-x-auto font-mono text-xs font-bold uppercase whitespace-nowrap">
		<a href="/dashboard" class="px-4 py-3 border-r-2 border-black { $page.url.pathname === '/dashboard' ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100' }">Overview</a>
		<a href="/dashboard/inventory" class="px-4 py-3 border-r-2 border-black { $page.url.pathname.startsWith('/dashboard/inventory') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100' }">Inventory</a>
		<a href="/dashboard/terminal" class="px-4 py-3 border-r-2 border-black { $page.url.pathname.startsWith('/dashboard/terminal') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500' }">Terminal</a>
		<a href="/dashboard/orders" class="px-4 py-3 { $page.url.pathname.startsWith('/dashboard/orders') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500' }">Ledger</a>
	</div>

	<!-- Page Content -->
	<main class="flex-1 w-full">
		{@render children()}
	</main>
</div>
