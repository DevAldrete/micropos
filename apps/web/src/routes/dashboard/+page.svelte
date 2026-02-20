<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard — MicroPOS</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">
			Welcome{data.user?.fullName ? `, ${data.user.fullName}` : ""}
		</h1>
		<p class="mt-1 text-sm text-gray-500">{data.user?.email}</p>
	</div>

	<!-- Placeholder dashboard grid -->
	<div class="grid gap-6 sm:grid-cols-3">
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-medium text-gray-500">Sales today</p>
			<p class="mt-2 text-3xl font-bold text-gray-900">—</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-medium text-gray-500">Orders</p>
			<p class="mt-2 text-3xl font-bold text-gray-900">—</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<p class="text-sm font-medium text-gray-500">Products</p>
			<p class="mt-2 text-3xl font-bold text-gray-900">—</p>
		</div>
	</div>

	<div
		class="mt-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-400"
	>
		<p class="text-sm">Dashboard content coming soon</p>
	</div>
</div>
