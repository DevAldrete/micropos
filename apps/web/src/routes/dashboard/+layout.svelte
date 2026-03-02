<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	let { children, data } = $props();

	let showTenantMenu = $state(false);

	const activeTenant = $derived(
		data.tenants?.find((t: any) => t.id === data.activeTenantId) ?? null
	);

	// Role-based navigation gating
	const userRole = $derived(data.userRole ?? 'employee');
	const isOwner = $derived(userRole === 'owner');
	const isAdminOrAbove = $derived(userRole === 'owner' || userRole === 'admin');

	async function switchTenant(tenantId: number) {
		// Set cookie via a simple document.cookie (client-side)
		document.cookie = `activeTenantId=${tenantId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
		showTenantMenu = false;
		// Reload current page data with the new tenant
		await invalidateAll();
	}
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
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname === '/dashboard' ? 'bg-[var(--color-brand)]' : ''}"
					>
						Overview
					</a>
					{#if isAdminOrAbove}
						<a 
							href="/dashboard/inventory" 
							class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname.startsWith('/dashboard/inventory') ? 'bg-[var(--color-brand)]' : ''}"
						>
							Inventory
						</a>
					{/if}
					<a 
						href="/dashboard/terminal" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname.startsWith('/dashboard/terminal') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white'}"
					>
						Terminal
					</a>
					{#if isAdminOrAbove}
						<a 
							href="/dashboard/customers" 
							class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname.startsWith('/dashboard/customers') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white'}"
						>
							Registry
						</a>
					{/if}
					<a 
						href="/dashboard/orders" 
						class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname.startsWith('/dashboard/orders') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white'}"
					>
						Ledger
					</a>
					{#if isOwner}
						<a 
							href="/dashboard/team" 
							class="px-4 py-2 hover:bg-[var(--color-brand)] transition-colors {$page.url.pathname.startsWith('/dashboard/team') ? 'bg-[var(--color-brand)] text-white' : 'text-gray-500 hover:text-white'}"
						>
							Team
						</a>
					{/if}
				</div>
			</div>

			<!-- User / System Status / Tenant Switcher -->
			<div class="flex items-center gap-4 font-mono text-xs font-bold uppercase">
				<!-- Tenant Switcher -->
				{#if data.tenants && data.tenants.length > 1}
					<div class="relative">
						<button
							onclick={() => showTenantMenu = !showTenantMenu}
							class="flex items-center gap-2 border border-gray-600 px-3 py-1.5 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
						>
							<span class="w-2 h-2 bg-[var(--color-brand)] inline-block"></span>
							{activeTenant?.name ?? 'SELECT TENANT'}
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><polyline points="6 9 12 15 18 9"></polyline></svg>
						</button>
						{#if showTenantMenu}
							<div class="absolute right-0 top-full mt-2 bg-white border-2 border-black brutal-shadow z-50 min-w-[200px]">
								{#each data.tenants as tenant}
									<button
										onclick={() => switchTenant(tenant.id)}
										class="w-full text-left px-4 py-3 text-black hover:bg-[var(--color-brand)] hover:text-white transition-colors flex items-center gap-2 border-b border-gray-200 last:border-b-0 {tenant.id === data.activeTenantId ? 'bg-gray-100' : ''}"
									>
										{#if tenant.id === data.activeTenantId}
											<span class="w-2 h-2 bg-[var(--color-brand)] inline-block"></span>
										{:else}
											<span class="w-2 h-2 border border-gray-400 inline-block"></span>
										{/if}
										{tenant.name}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{:else if activeTenant}
					<div class="hidden md:flex items-center gap-2 text-gray-400 border border-gray-700 px-2 py-1">
						<span class="w-2 h-2 bg-[var(--color-brand)] inline-block"></span>
						{activeTenant.name}
					</div>
				{/if}

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
		<a href="/dashboard" class="px-4 py-3 border-r-2 border-black {$page.url.pathname === '/dashboard' ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100'}">Overview</a>
		{#if isAdminOrAbove}
			<a href="/dashboard/inventory" class="px-4 py-3 border-r-2 border-black {$page.url.pathname.startsWith('/dashboard/inventory') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100'}">Inventory</a>
		{/if}
		<a href="/dashboard/terminal" class="px-4 py-3 border-r-2 border-black {$page.url.pathname.startsWith('/dashboard/terminal') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500'}">Terminal</a>
		{#if isAdminOrAbove}
			<a href="/dashboard/customers" class="px-4 py-3 border-r-2 border-black {$page.url.pathname.startsWith('/dashboard/customers') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500'}">Registry</a>
		{/if}
		<a href="/dashboard/orders" class="px-4 py-3 border-r-2 border-black {$page.url.pathname.startsWith('/dashboard/orders') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500'}">Ledger</a>
		{#if isOwner}
			<a href="/dashboard/team" class="px-4 py-3 {$page.url.pathname.startsWith('/dashboard/team') ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-gray-100 text-gray-500'}">Team</a>
		{/if}
	</div>

	<!-- Page Content -->
	<main class="flex-1 w-full">
		{@render children()}
	</main>
</div>
