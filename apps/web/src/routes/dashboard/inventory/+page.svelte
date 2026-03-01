<script lang="ts">
	import { enhance } from "$app/forms";
	import { fade, slide } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data, form }: { data: PageData; form: any } = $props();

	// State for UI toggles
	let showAddCategory = $state(false);
	let showAddProduct = $state(false);

	// Derived totals
	let totalProducts = $derived(data.products?.length || 0);
	let totalCategories = $derived(data.categories?.length || 0);
	let lowStockCount = $derived(data.products?.filter((p: any) => p.stock < 10).length || 0);
</script>

<svelte:head>
	<title>[ SYS_INV ] - MicroPOS</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-4 md:px-8 py-8 w-full min-h-screen">
	
	<!-- Header Section -->
	<header class="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-6 gap-6 relative">
		<!-- Decorative barcode-like lines -->
		<div class="absolute top-0 right-0 flex gap-1 opacity-20 pointer-events-none">
			{#each Array(15) as _, i}
				<div class="h-16 bg-black" style="width: {Math.random() * 8 + 2}px"></div>
			{/each}
		</div>

		<div class="relative z-10">
			<div class="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-black text-[var(--color-surface)] px-3 py-1.5 brutal-shadow">
				<div class="relative flex h-3 w-3">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand)] opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-brand)]"></span>
				</div>
				DATA_LINK: ESTABLISHED
			</div>
			<h1 class="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
				Inventory<br />
				<span class="text-[var(--color-brand)]">Manifest</span>
			</h1>
		</div>

		<div class="flex gap-4 font-mono text-sm bg-white border-2 border-black p-4 brutal-shadow z-10">
			<div class="flex flex-col">
				<span class="text-gray-500 font-bold uppercase text-xs">Categories</span>
				<span class="text-2xl font-black">{totalCategories}</span>
			</div>
			<div class="w-0.5 bg-black"></div>
			<div class="flex flex-col">
				<span class="text-gray-500 font-bold uppercase text-xs">Products</span>
				<span class="text-2xl font-black">{totalProducts}</span>
			</div>
			<div class="w-0.5 bg-black"></div>
			<div class="flex flex-col">
				<span class="text-gray-500 font-bold uppercase text-xs">Low Stock</span>
				<span class="text-2xl font-black text-[var(--color-brand)]">{lowStockCount}</span>
			</div>
		</div>
	</header>

	{#if form?.error}
		<div class="bg-black text-[var(--color-brand)] font-mono p-4 mb-8 border-2 border-[var(--color-brand)] brutal-shadow flex justify-between items-center" transition:fade>
			<span class="font-bold">>> ERR: {form.error}</span>
		</div>
	{/if}

	<div class="grid gap-8 lg:grid-cols-12 items-start">
		
		<!-- LEFT COLUMN: Categories -->
		<div class="lg:col-span-4 flex flex-col gap-6">
			<div class="bg-[var(--color-brand)] border-2 border-black p-4 brutal-shadow flex justify-between items-center">
				<h2 class="font-display text-2xl font-black uppercase tracking-tight text-white mix-blend-difference">Taxonomy</h2>
				<button 
					onclick={() => showAddCategory = !showAddCategory}
					class="font-mono text-xs font-bold uppercase bg-white text-black px-3 py-1 border-2 border-black hover:bg-black hover:text-white transition-colors"
				>
					{showAddCategory ? '[-] Close' : '[+] Add'}
				</button>
			</div>

			{#if showAddCategory}
				<div class="bg-white border-2 border-black p-5 brutal-shadow" transition:slide>
					<form method="POST" action="?/createCategory" use:enhance={() => {
						return async ({ update }) => {
							await update();
							showAddCategory = false;
						};
					}}>
						<input type="hidden" name="tenantId" value={data.activeTenantId} />
						
						<div class="space-y-4">
							<div>
								<label for="cat-name" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Name</label>
								<input id="cat-name" name="name" type="text" required class="w-full brutal-input" placeholder="e.g. Peripherals" />
							</div>
							<div>
								<label for="cat-desc" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Desc</label>
								<input id="cat-desc" name="description" type="text" class="w-full brutal-input" placeholder="Optional details..." />
							</div>
							<button type="submit" class="w-full bg-black text-white font-mono text-sm font-bold uppercase py-3 border-2 border-black hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors mt-2">
								Execute
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Category List -->
			<div class="bg-white border-2 border-black brutal-shadow">
				{#if data.categories?.length === 0}
					<div class="p-8 text-center font-mono text-gray-500 uppercase text-sm">NO_DATA_FOUND</div>
				{:else}
					<ul class="divide-y-2 divide-black">
						{#each data.categories as cat (cat.id)}
							<li class="p-4 hover:bg-[var(--color-surface)] group transition-colors cursor-pointer relative overflow-hidden">
								<!-- Hover highlight block -->
								<div class="absolute left-0 top-0 bottom-0 w-2 bg-[var(--color-brand)] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
								<div class="flex justify-between items-center">
									<div>
										<h3 class="font-display font-bold text-lg uppercase group-hover:pl-4 transition-all">{cat.name}</h3>
										{#if cat.description}
											<p class="font-mono text-xs text-gray-500 group-hover:pl-4 transition-all">{cat.description}</p>
										{/if}
									</div>
									<span class="font-mono text-xs text-gray-400">ID:{cat.id}</span>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<!-- RIGHT COLUMN: Products -->
		<div class="lg:col-span-8 flex flex-col gap-6">
			
			<div class="bg-black border-2 border-black p-4 brutal-shadow flex justify-between items-center text-white">
				<h2 class="font-display text-2xl font-black uppercase tracking-tight">Active_Assets</h2>
				<button 
					onclick={() => showAddProduct = !showAddProduct}
					class="font-mono text-xs font-bold uppercase bg-[var(--color-brand)] text-white px-3 py-1 border-2 border-[var(--color-brand)] hover:bg-white hover:text-black hover:border-white transition-colors"
				>
					{showAddProduct ? '[-] Close' : '[+] Add Product'}
				</button>
			</div>

			{#if showAddProduct}
				<div class="bg-white border-2 border-black p-6 brutal-shadow relative overflow-hidden" transition:slide>
					<!-- Decor pattern -->
					<div class="absolute right-0 bottom-0 w-32 h-32 grid-bg opacity-20 pointer-events-none"></div>

					<form method="POST" action="?/createProduct" use:enhance={() => {
						return async ({ update }) => {
							await update();
							showAddProduct = false;
						};
					}}>
						<input type="hidden" name="tenantId" value={data.activeTenantId} />
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-4">
								<div>
									<label for="prod-name" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Designation</label>
									<input id="prod-name" name="name" type="text" required class="w-full brutal-input" placeholder="Product Name" />
								</div>
								<div>
									<label for="prod-sku" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> SKU / UID</label>
									<input id="prod-sku" name="sku" type="text" class="w-full brutal-input" placeholder="PRD-001" />
								</div>
								<div>
									<label for="prod-cat" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Category (Opt)</label>
									<select id="prod-cat" name="categoryId" class="w-full brutal-input appearance-none rounded-none bg-white">
										<option value="">-- NULL --</option>
										{#each data.categories as cat}
											<option value={cat.id}>{cat.name}</option>
										{/each}
									</select>
								</div>
							</div>
							
							<div class="space-y-4">
								<div>
									<label for="prod-price" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Unit Price ($)</label>
									<input id="prod-price" name="price" type="number" step="0.01" min="0" required class="w-full brutal-input font-bold text-lg" placeholder="0.00" />
								</div>
								<div>
									<label for="prod-stock" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Stock Level</label>
									<input id="prod-stock" name="stock" type="number" min="0" required class="w-full brutal-input font-bold text-lg" placeholder="0" />
								</div>
								<div>
									<label for="prod-desc" class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1">> Parameters</label>
									<input id="prod-desc" name="description" type="text" class="w-full brutal-input" placeholder="Additional details..." />
								</div>
							</div>
						</div>

						<div class="mt-8 flex justify-end">
							<button type="submit" class="bg-[var(--color-brand)] text-white font-mono text-lg font-black uppercase px-8 py-3 border-2 border-black hover:bg-black transition-colors brutal-shadow relative z-10">
								Inject Data
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Products Table -->
			<div class="bg-white border-2 border-black brutal-shadow overflow-x-auto">
				<table class="w-full text-left font-mono text-sm whitespace-nowrap">
					<thead class="bg-black text-white text-xs uppercase tracking-widest border-b-2 border-black">
						<tr>
							<th class="px-5 py-4 font-bold">UID / SKU</th>
							<th class="px-5 py-4 font-bold">Designation</th>
							<th class="px-5 py-4 font-bold text-right">Unit_Cost</th>
							<th class="px-5 py-4 font-bold text-right">Qty</th>
							<th class="px-5 py-4 font-bold text-center">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y-2 divide-black">
						{#if data.products?.length === 0}
							<tr>
								<td colspan="5" class="p-8 text-center text-gray-500 uppercase">Awaiting Input...</td>
							</tr>
						{:else}
							{#each data.products as prod (prod.id)}
								<tr class="hover:bg-[var(--color-brand)] hover:text-white transition-colors group cursor-crosshair">
									<td class="px-5 py-4 text-gray-500 group-hover:text-white/80 transition-colors">
										{prod.sku || `ID-${prod.id.toString().padStart(4, '0')}`}
									</td>
									<td class="px-5 py-4 font-bold font-display text-lg uppercase tracking-tight">
										{prod.name}
									</td>
									<td class="px-5 py-4 text-right font-black text-lg">
										${Number(prod.price).toFixed(2)}
									</td>
									<td class="px-5 py-4 text-right font-bold text-lg {prod.stock < 10 && 'text-[var(--color-brand)] group-hover:text-black'}">
										{prod.stock}
									</td>
									<td class="px-5 py-4 text-center">
										{#if prod.stock === 0}
											<span class="inline-block bg-black text-white px-2 py-1 text-[10px] font-bold border border-current">DEPLETED</span>
										{:else if prod.stock < 10}
											<span class="inline-block bg-[var(--color-brand)] text-white px-2 py-1 text-[10px] font-bold border border-current group-hover:bg-white group-hover:text-[var(--color-brand)]">CRITICAL</span>
										{:else}
											<span class="inline-block bg-white text-black px-2 py-1 text-[10px] font-bold border border-current group-hover:bg-black group-hover:text-white">OPTIMAL</span>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
