<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { fade, slide } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data, form }: { data: PageData; form: any } = $props();

	let showAddCustomer = $state(false);
	let editingCustomerId = $state<number | null>(null);
	let searchInput = $state("");

	// Pagination from server data
	let customersMeta = $derived(
		data.customers?.meta ?? {
			total: 0,
			perPage: 20,
			currentPage: 1,
			lastPage: 1,
			firstPage: 1,
		},
	);
	let customersData = $derived(data.customers?.data ?? []);

	function goToPage(pageNum: number): void {
		const params = new URLSearchParams($page.url.searchParams);
		params.set("page", String(pageNum));
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	function handleSearch(): void {
		const params = new URLSearchParams();
		if (searchInput.trim()) {
			params.set("search", searchInput.trim());
		}
		params.set("page", "1");
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	function clearSearch(): void {
		searchInput = "";
		goto("?page=1", { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>[ REGISTRY ] - MicroPOS</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-4 md:px-8 py-8 w-full min-h-screen">
	<!-- Header Section -->
	<header
		class="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-6 gap-6 relative"
	>
		<!-- Decorative barcode-like lines -->
		<div class="absolute top-0 right-0 flex gap-1 opacity-20 pointer-events-none">
			{#each Array(15) as _, i}
				<div class="h-16 bg-black" style="width: {Math.random() * 8 + 2}px"></div>
			{/each}
		</div>

		<div class="relative z-10">
			<div
				class="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-black text-[var(--color-surface)] px-3 py-1.5 brutal-shadow"
			>
				<div class="relative flex h-3 w-3">
					<span
						class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
					></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
				</div>
				REGISTRY: ONLINE
			</div>
			<h1
				class="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none"
			>
				Customer<br />
				<span class="text-emerald-600">Registry</span>
			</h1>
		</div>

		<div
			class="flex gap-4 font-mono text-sm bg-white border-2 border-black p-4 brutal-shadow z-10"
		>
			<div class="flex flex-col">
				<span class="text-gray-500 font-bold uppercase text-xs">Total Records</span>
				<span class="text-2xl font-black">{customersMeta.total}</span>
			</div>
		</div>
	</header>

	{#if data.tenants?.length === 0}
		<div
			class="bg-emerald-600 text-white font-mono p-8 mb-8 border-2 border-black brutal-shadow text-center"
		>
			<h2 class="text-2xl font-black uppercase tracking-widest mb-4">
				No Data Link Established
			</h2>
			<p class="mb-4">
				Your operator account is not assigned to any Active Storefronts (Tenants).
			</p>
			<p class="text-xs opacity-75">
				&gt;&gt; Please register a new operator account to auto-provision a storefront. &lt;&lt;
			</p>
		</div>
	{:else}
		{#if form?.error}
			<div
				class="bg-black text-[var(--color-brand)] font-mono p-4 mb-8 border-2 border-[var(--color-brand)] brutal-shadow flex justify-between items-center"
				transition:fade
			>
				<span class="font-bold">&gt;&gt; ERR: {form.error}</span>
			</div>
		{/if}

		<!-- Search + Add Bar -->
		<div
			class="bg-black border-2 border-black p-4 brutal-shadow flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6"
		>
			<div class="flex gap-2 items-center flex-1">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSearch();
					}}
					class="flex gap-2 flex-1 max-w-md"
				>
					<input
						type="text"
						bind:value={searchInput}
						placeholder="SEARCH_QUERY..."
						class="brutal-input text-black py-1 px-2 text-xs w-full font-mono"
					/>
					<button
						type="submit"
						class="font-mono text-xs font-bold uppercase bg-white text-black px-3 py-1 border-2 border-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-colors"
					>
						Search
					</button>
					{#if $page.url.searchParams.get("search")}
						<button
							type="button"
							onclick={clearSearch}
							class="font-mono text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors px-2"
						>
							[Clear]
						</button>
					{/if}
				</form>
			</div>

			<button
				onclick={() => (showAddCustomer = !showAddCustomer)}
				class="font-mono text-xs font-bold uppercase bg-emerald-500 text-white px-4 py-2 border-2 border-emerald-500 hover:bg-white hover:text-black hover:border-white transition-colors"
			>
				{showAddCustomer ? "[-] Close" : "[+] Add Customer"}
			</button>
		</div>

		<!-- Add Customer Form -->
		{#if showAddCustomer}
			<div
				class="bg-white border-2 border-black p-6 brutal-shadow mb-6 relative overflow-hidden"
				transition:slide
			>
				<div
					class="absolute right-0 bottom-0 w-32 h-32 grid-bg opacity-20 pointer-events-none"
				></div>

				<form
					method="POST"
					action="?/createCustomer"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							showAddCustomer = false;
						};
					}}
				>
					<input type="hidden" name="tenantId" value={data.activeTenantId} />

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
						<label
							for="cust-name"
							class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
							>&gt; Name *</label
						>
							<input
								id="cust-name"
								name="name"
								type="text"
								required
								class="w-full brutal-input"
								placeholder="Full Name"
							/>
						</div>
						<div>
						<label
							for="cust-email"
							class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
							>&gt; Email</label
						>
							<input
								id="cust-email"
								name="email"
								type="email"
								class="w-full brutal-input"
								placeholder="customer@example.com"
							/>
						</div>
						<div>
						<label
							for="cust-phone"
							class="block font-mono text-xs font-bold uppercase text-gray-600 mb-1"
							>&gt; Phone</label
						>
							<input
								id="cust-phone"
								name="phone"
								type="tel"
								class="w-full brutal-input"
								placeholder="+1 555-0123"
							/>
						</div>
					</div>

					<div class="mt-6 flex justify-end">
						<button
							type="submit"
							class="bg-emerald-600 text-white font-mono text-sm font-black uppercase px-8 py-3 border-2 border-black hover:bg-black transition-colors brutal-shadow"
						>
							Register Customer
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Customers Table -->
		<div class="bg-white border-2 border-black brutal-shadow overflow-x-auto">
			<table class="w-full text-left font-mono text-sm whitespace-nowrap">
				<thead
					class="bg-black text-white text-xs uppercase tracking-widest border-b-2 border-black"
				>
					<tr>
						<th class="px-5 py-4 font-bold">Reg_ID</th>
						<th class="px-5 py-4 font-bold">Designation</th>
						<th class="px-5 py-4 font-bold">Contact_Email</th>
						<th class="px-5 py-4 font-bold">Contact_Phone</th>
						<th class="px-5 py-4 font-bold">Registered</th>
						<th class="px-5 py-4 font-bold text-center">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y-2 divide-black">
					{#if customersData.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-gray-500 uppercase font-bold"
								>No Records Found</td
							>
						</tr>
					{:else}
						{#each customersData as customer (customer.id)}
							{#if editingCustomerId === customer.id}
								<tr class="bg-[var(--color-surface)] border-b-2 border-black">
									<td colspan="6" class="p-4">
										<form
											method="POST"
											action="?/updateCustomer"
											class="grid grid-cols-12 gap-4"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													editingCustomerId = null;
												};
											}}
										>
											<input type="hidden" name="id" value={customer.id} />
											<input
												type="hidden"
												name="tenantId"
												value={data.activeTenantId}
											/>

											<div class="col-span-4">
												<label
													class="text-[10px] font-bold text-gray-500 block mb-1"
													>NAME</label
												>
												<input
													name="name"
													type="text"
													value={customer.name}
													required
													class="w-full brutal-input py-1 px-2 text-xs"
												/>
											</div>
											<div class="col-span-3">
												<label
													class="text-[10px] font-bold text-gray-500 block mb-1"
													>EMAIL</label
												>
												<input
													name="email"
													type="email"
													value={customer.email || ""}
													class="w-full brutal-input py-1 px-2 text-xs"
												/>
											</div>
											<div class="col-span-3">
												<label
													class="text-[10px] font-bold text-gray-500 block mb-1"
													>PHONE</label
												>
												<input
													name="phone"
													type="tel"
													value={customer.phone || ""}
													class="w-full brutal-input py-1 px-2 text-xs"
												/>
											</div>
											<div class="col-span-12 flex justify-end gap-2 mt-2">
												<button
													type="button"
													onclick={() => (editingCustomerId = null)}
													class="bg-white text-black border-2 border-black font-mono text-xs px-4 py-2 hover:bg-gray-100"
													>CANCEL</button
												>
												<button
													type="submit"
													class="bg-black text-white font-mono text-xs px-4 py-2 hover:bg-emerald-600 border-2 border-black"
													>UPDATE</button
												>
												<button
													formaction="?/deleteCustomer"
													class="bg-red-500 text-white font-mono text-xs px-4 py-2 border-2 border-red-700 hover:bg-red-600 ml-4"
													>DELETE</button
												>
											</div>
										</form>
									</td>
								</tr>
							{:else}
								<tr
									onclick={() => (editingCustomerId = customer.id)}
									onkeydown={(e) =>
										e.key === "Enter" && (editingCustomerId = customer.id)}
									tabindex="0"
									class="hover:bg-emerald-50 transition-colors group cursor-pointer"
								>
									<td class="px-5 py-4 text-gray-500 group-hover:text-emerald-700">
										CX-{customer.id.toString().padStart(4, "0")}
									</td>
									<td
										class="px-5 py-4 font-bold font-display text-lg uppercase tracking-tight"
									>
										{customer.name}
									</td>
									<td class="px-5 py-4 text-gray-600">
										{customer.email || "--"}
									</td>
									<td class="px-5 py-4 text-gray-600">
										{customer.phone || "--"}
									</td>
									<td class="px-5 py-4 text-gray-500 text-xs">
										{new Date(customer.createdAt).toLocaleDateString()}
									</td>
									<td class="px-5 py-4 text-center">
										<span
											class="text-emerald-600 font-bold underline decoration-2 underline-offset-4 text-xs uppercase"
											>EDIT</span
										>
									</td>
								</tr>
							{/if}
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		{#if customersMeta.lastPage > 1}
			<div
				class="flex items-center justify-between bg-white border-2 border-black brutal-shadow p-4 font-mono text-sm mt-6"
			>
				<span class="text-gray-500 font-bold uppercase text-xs">
					Page {customersMeta.currentPage} of {customersMeta.lastPage} &mdash;
					{customersMeta.total} records
				</span>
				<div class="flex gap-2">
					<button
						onclick={() => goToPage(customersMeta.currentPage - 1)}
						disabled={customersMeta.currentPage <= 1}
						class="px-3 py-1 border-2 border-black font-bold uppercase text-xs
							{customersMeta.currentPage <= 1
							? 'bg-gray-200 text-gray-400 cursor-not-allowed'
							: 'bg-white text-black hover:bg-black hover:text-white transition-colors'}"
					>
						&lt; Prev
					</button>
					{#each Array(customersMeta.lastPage) as _, i}
						{@const pageNum = i + 1}
						{#if customersMeta.lastPage <= 7 || pageNum === 1 || pageNum === customersMeta.lastPage || (pageNum >= customersMeta.currentPage - 1 && pageNum <= customersMeta.currentPage + 1)}
							<button
								onclick={() => goToPage(pageNum)}
								class="px-3 py-1 border-2 border-black font-bold text-xs
									{pageNum === customersMeta.currentPage
									? 'bg-black text-white'
									: 'bg-white text-black hover:bg-black hover:text-white transition-colors'}"
							>
								{pageNum}
							</button>
						{:else if pageNum === customersMeta.currentPage - 2 || pageNum === customersMeta.currentPage + 2}
							<span class="px-1 py-1 text-gray-400 font-bold">...</span>
						{/if}
					{/each}
					<button
						onclick={() => goToPage(customersMeta.currentPage + 1)}
						disabled={customersMeta.currentPage >= customersMeta.lastPage}
						class="px-3 py-1 border-2 border-black font-bold uppercase text-xs
							{customersMeta.currentPage >= customersMeta.lastPage
							? 'bg-gray-200 text-gray-400 cursor-not-allowed'
							: 'bg-white text-black hover:bg-black hover:text-white transition-colors'}"
					>
						Next &gt;
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
