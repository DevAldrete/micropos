<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>MicroPOS — Simple point of sale for modern businesses</title>
</svelte:head>

<!-- Hero -->
<section class="bg-white px-4 py-24 text-center">
	<div class="mx-auto max-w-2xl">
		<span
			class="mb-4 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600"
		>
			Now in early access
		</span>

		<h1 class="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			The point of sale<br />built for <span class="text-indigo-600">you</span>
		</h1>

		<p class="mt-6 text-lg text-gray-500">
			MicroPOS helps small businesses manage sales, inventory, and customers — all from one
			simple dashboard.
		</p>

		<div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
			{#if data.user}
				<a
					href="/dashboard"
					class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Go to dashboard
				</a>
			{:else}
				<a
					href="/register"
					class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Get started for free
				</a>
				<a
					href="/login"
					class="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Sign in
				</a>
			{/if}
		</div>
	</div>
</section>

<!-- Features -->
<section class="bg-gray-50 px-4 py-20">
	<div class="mx-auto max-w-5xl">
		<h2 class="text-center text-2xl font-bold text-gray-900">Everything you need to sell</h2>
		<p class="mt-3 text-center text-gray-500">
			No bloat. No complexity. Just the tools that matter.
		</p>

		<div class="mt-12 grid gap-8 sm:grid-cols-3">
			<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div
					class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900">Fast checkout</h3>
				<p class="mt-2 text-sm text-gray-500">
					Ring up sales in seconds. Accept cash, card, or any payment method.
				</p>
			</div>

			<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div
					class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900">Inventory tracking</h3>
				<p class="mt-2 text-sm text-gray-500">
					Know what's in stock at all times. Get low-stock alerts before you run out.
				</p>
			</div>

			<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div
					class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900">Sales reports</h3>
				<p class="mt-2 text-sm text-gray-500">
					Understand your business with clear daily, weekly, and monthly reports.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA banner -->
{#if !data.user}
	<section class="bg-indigo-600 px-4 py-16 text-center">
		<div class="mx-auto max-w-xl">
			<h2 class="text-2xl font-bold text-white">Ready to get started?</h2>
			<p class="mt-3 text-indigo-200">
				Create your free account and be up and running in minutes.
			</p>
			<a
				href="/register"
				class="mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
			>
				Create free account
			</a>
		</div>
	</section>
{/if}
