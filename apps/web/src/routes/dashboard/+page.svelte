<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	// Mock data for the demo dashboard
	const recentTransactions = [
		{ id: "TX-9942", amount: "$142.50", status: "COMPLETED", time: "10:42 AM" },
		{ id: "TX-9941", amount: "$84.00", status: "COMPLETED", time: "10:15 AM" },
		{ id: "TX-9940", amount: "$210.25", status: "PENDING", time: "09:30 AM" },
		{ id: "TX-9939", amount: "$12.99", status: "COMPLETED", time: "09:05 AM" },
	];
</script>

<svelte:head>
	<title>System Dashboard — MicroPOS</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-6 py-12 w-full">
	<div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-black pb-6 gap-6">
		<div>
			<div class="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest mb-4 bg-black text-white px-2 py-1">
				<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
				SYSTEM ONLINE
			</div>
			<h1 class="text-5xl font-display font-black uppercase tracking-tight">
				Command<br /><span class="text-[var(--color-brand)]">Center</span>
			</h1>
		</div>
		<div class="text-left md:text-right font-mono text-sm">
			<p class="font-bold uppercase text-gray-500">OPERATOR</p>
			<p class="text-lg font-bold border-b-2 border-[var(--color-brand)] inline-block pb-1">{data.user?.fullName ?? data.user?.email}</p>
		</div>
	</div>

	<!-- Dashboard Grid -->
	<div class="grid gap-8 lg:grid-cols-3 mb-12">
		<div class="bg-white border-2 border-black p-6 brutal-shadow flex flex-col justify-between">
			<div class="flex justify-between items-start mb-8">
				<p class="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">Gross Volume</p>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-[var(--color-brand)]"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
			</div>
			<div>
				<p class="text-5xl font-display font-black tracking-tighter">$4,294.50</p>
				<p class="font-mono text-sm font-bold text-green-600 mt-2">↑ 14.2% VS LAST WK</p>
			</div>
		</div>

		<div class="bg-black text-white border-2 border-black p-6 brutal-shadow flex flex-col justify-between relative overflow-hidden">
			<div class="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-brand)] blur-[40px] opacity-40"></div>
			<div class="flex justify-between items-start mb-8 relative z-10">
				<p class="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Total Orders</p>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
			</div>
			<div class="relative z-10">
				<p class="text-5xl font-display font-black tracking-tighter text-[var(--color-brand)]">142</p>
				<p class="font-mono text-sm font-bold text-gray-400 mt-2">ACTIVE SESSION</p>
			</div>
		</div>

		<div class="bg-[var(--color-brand)] text-white border-2 border-black p-6 brutal-shadow flex flex-col justify-between">
			<div class="flex justify-between items-start mb-8">
				<p class="font-mono text-xs font-bold uppercase tracking-widest text-white/80">Active Inventory</p>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
			</div>
			<div>
				<p class="text-5xl font-display font-black tracking-tighter">8,942</p>
				<p class="font-mono text-sm font-bold text-black mt-2">12 LOW STOCK ALERTS</p>
			</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<div class="bg-white border-2 border-black brutal-shadow">
				<div class="border-b-2 border-black p-4 flex justify-between items-center bg-gray-50">
					<h2 class="font-display text-xl font-black uppercase tracking-tight">Recent Transactions</h2>
					<button class="font-mono text-xs font-bold uppercase hover:text-[var(--color-brand)] underline decoration-2 underline-offset-4">VIEW ALL</button>
				</div>
				<div class="p-0">
					<table class="w-full text-left font-mono text-sm">
						<thead class="bg-black text-white text-xs uppercase">
							<tr>
								<th class="px-6 py-3 font-bold">ID</th>
								<th class="px-6 py-3 font-bold">Amount</th>
								<th class="px-6 py-3 font-bold">Status</th>
								<th class="px-6 py-3 font-bold text-right">Time</th>
							</tr>
						</thead>
						<tbody class="divide-y-2 divide-black">
							{#each recentTransactions as tx}
								<tr class="hover:bg-[var(--color-brand)] hover:text-white transition-colors group cursor-pointer">
									<td class="px-6 py-4 font-bold">{tx.id}</td>
									<td class="px-6 py-4">{tx.amount}</td>
									<td class="px-6 py-4">
										<span class="px-2 py-1 text-xs font-bold {tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800 group-hover:bg-green-500 group-hover:text-white' : 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-500 group-hover:text-white'} border border-current">
											{tx.status}
										</span>
									</td>
									<td class="px-6 py-4 text-right text-gray-500 group-hover:text-white/80">{tx.time}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div>
			<div class="bg-white border-2 border-black brutal-shadow h-full flex flex-col">
				<div class="border-b-2 border-black p-4 bg-[var(--color-brand)] text-white">
					<h2 class="font-display text-xl font-black uppercase tracking-tight">Quick Actions</h2>
				</div>
				<div class="p-6 flex-1 flex flex-col gap-4 justify-center">
					<button class="w-full border-2 border-black bg-black text-white font-mono text-sm font-bold uppercase tracking-widest py-4 hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors brutal-shadow">
						+ NEW SALE
					</button>
					<button class="w-full border-2 border-black bg-white text-black font-mono text-sm font-bold uppercase tracking-widest py-4 hover:bg-gray-100 transition-colors brutal-shadow">
						SCAN BARCODE
					</button>
					<a href="/dashboard/inventory" class="w-full text-center block border-2 border-black bg-white text-black font-mono text-sm font-bold uppercase tracking-widest py-4 hover:bg-[var(--color-brand)] hover:text-white transition-colors brutal-shadow">
						INVENTORY_DB
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
