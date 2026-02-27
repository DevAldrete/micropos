<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>MicroPOS — Free real-time Point of Sale & ERP</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative px-6 py-24 md:py-32 xl:py-48 flex flex-col items-center justify-center overflow-hidden grid-bg">
	<div class="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-lg max-h-lg bg-[var(--color-brand)] rounded-full blur-[120px] opacity-20 -z-10 translate-x-1/4 -translate-y-1/4 mix-blend-multiply"></div>
	<div class="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-md max-h-md bg-black rounded-full blur-[100px] opacity-10 -z-10 -translate-x-1/4 translate-y-1/4 mix-blend-multiply"></div>

	<div class="max-w-5xl mx-auto w-full text-center flex flex-col items-center">
		<div class="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white brutal-shadow font-mono text-sm uppercase tracking-widest font-bold mb-12 transform -rotate-2">
			<span class="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse"></span>
			<span>EARLY ACCESS v1.0</span>
		</div>

		<h1 class="text-6xl sm:text-7xl md:text-[6rem] lg:text-[8rem] font-black font-display uppercase tracking-tighter leading-[0.85] mb-8 text-balance">
			THE ERP FOR<br />
			<span class="text-white relative inline-block">
				<span class="absolute inset-0 bg-[var(--color-brand)] -skew-y-2 brutal-shadow"></span>
				<span class="relative z-10 px-4">EVERYONE</span>
			</span>
		</h1>

		<p class="mt-8 text-xl md:text-2xl font-sans font-medium text-black max-w-2xl text-balance">
			MicroPOS is a free, real-time Point of Sale and ERP platform. Track stock, manage payments, and collaborate instantly. No catch.
		</p>

		<div class="mt-16 flex flex-col sm:flex-row items-center gap-6 font-mono font-bold uppercase w-full sm:w-auto">
			{#if data.user}
				<a
					href="/dashboard"
					class="w-full sm:w-auto px-8 py-5 border-2 border-black bg-[var(--color-brand)] text-white text-lg brutal-shadow hover:bg-black transition-colors flex items-center justify-center gap-3"
				>
					ENTER DASHBOARD
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
				</a>
			{:else}
				<a
					href="/register"
					class="w-full sm:w-auto px-8 py-5 border-2 border-black bg-[var(--color-brand)] text-white text-lg brutal-shadow hover:bg-black transition-colors flex items-center justify-center gap-3"
				>
					CLAIM YOUR STORE
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
				</a>
				<a
					href="/login"
					class="w-full sm:w-auto px-8 py-5 border-2 border-black bg-white text-black text-lg brutal-shadow hover:bg-gray-100 transition-colors flex items-center justify-center"
				>
					SYSTEM LOGIN
				</a>
			{/if}
		</div>
	</div>
</section>

<!-- Features Manifesto -->
<section class="border-t-2 border-black bg-white">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black border-b-2 border-black">
		<div class="p-10 md:p-14 lg:p-16 flex flex-col justify-between group hover:bg-[var(--color-brand)] hover:text-white transition-colors duration-300 cursor-default min-h-[400px]">
			<div class="font-mono text-5xl font-bold opacity-20 group-hover:opacity-100 transition-opacity">01</div>
			<div>
				<h3 class="font-display text-4xl uppercase font-black mb-4">MULTI-TENANT<br />ARCHITECTURE</h3>
				<p class="font-sans text-lg group-hover:text-white/90 font-medium">
					Sign up as an owner and create your own business POS in seconds. Deploy globally, manage locally.
				</p>
			</div>
		</div>

		<div class="p-10 md:p-14 lg:p-16 flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-300 cursor-default min-h-[400px]">
			<div class="font-mono text-5xl font-bold opacity-20 group-hover:opacity-100 transition-opacity text-[var(--color-brand)]">02</div>
			<div>
				<h3 class="font-display text-4xl uppercase font-black mb-4">REAL-TIME<br />SYNC PROTOCOL</h3>
				<p class="font-sans text-lg group-hover:text-white/90 font-medium">
					WebSockets ensure all changes sync instantly across every connected employee. Zero lag.
				</p>
			</div>
		</div>

		<div class="p-10 md:p-14 lg:p-16 flex flex-col justify-between group hover:bg-[#F4F4F0] transition-colors duration-300 cursor-default min-h-[400px]">
			<div class="font-mono text-5xl font-bold opacity-20 transition-opacity text-[var(--color-brand)]">03</div>
			<div>
				<h3 class="font-display text-4xl uppercase font-black mb-4">INVENTORY &<br />PAYMENTS</h3>
				<p class="font-sans text-lg text-black font-medium">
					Track stock levels interactively. Manage transactions and generate invoices on the fly.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Technical Readout Section -->
<section class="bg-black text-white px-6 py-24 md:py-32 border-b-2 border-black overflow-hidden relative">
	<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
		<div>
			<h2 class="font-display text-5xl sm:text-6xl md:text-7xl font-black uppercase mb-8 leading-[0.9]">
				RAW POWER.<br />
				<span class="text-[var(--color-brand)]">NO BLOAT.</span>
			</h2>
			<p class="font-sans text-xl font-medium text-gray-300 max-w-xl mb-12">
				MicroPOS drops the traditional SaaS overhead. Built on a monorepo with Turborepo, powered by AdonisJS and SvelteKit.
			</p>
			<div class="flex flex-col gap-4 font-mono text-sm uppercase font-bold w-full max-w-md">
				<div class="flex justify-between border-b border-gray-800 pb-2">
					<span class="text-gray-500">FRONTEND</span>
					<span>SvelteKit 2 + Tailwind v4</span>
				</div>
				<div class="flex justify-between border-b border-gray-800 pb-2">
					<span class="text-gray-500">BACKEND</span>
					<span>AdonisJS 6 (Node.js)</span>
				</div>
				<div class="flex justify-between border-b border-gray-800 pb-2">
					<span class="text-gray-500">DATABASE</span>
					<span>PostgreSQL + Lucid ORM</span>
				</div>
				<div class="flex justify-between pb-2">
					<span class="text-gray-500">LANGUAGE</span>
					<span>TypeScript (Strict)</span>
				</div>
			</div>
		</div>

		<div class="bg-[#111] border-2 border-gray-800 p-6 md:p-10 relative group">
			<div class="absolute top-0 right-0 p-4 font-mono text-xs text-[var(--color-brand)]">SYS.LOG</div>
			<div class="font-mono text-sm md:text-base leading-relaxed text-gray-400 font-bold">
				<div class="flex gap-4 mb-2"><span class="text-gray-600">01</span><span class="text-[var(--color-brand)]">npm</span> <span class="text-white">run dev</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">02</span><span class="text-gray-500">&gt; micropos@1.0.0 dev</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">03</span><span class="text-gray-500">&gt; turbo run dev</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">04</span><span></span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">05</span><span class="text-green-500">api:</span> <span class="text-white">started server on http://localhost:3333</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">06</span><span class="text-green-500">api:</span> <span class="text-white">database connected successfully (postgres)</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">07</span><span class="text-blue-500">web:</span> <span class="text-white">VITE v5.0.0 ready in 142 ms</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">08</span><span class="text-blue-500">web:</span> <span class="text-white">➜  Local:   http://localhost:5173/</span></div>
				<div class="flex gap-4 mb-2"><span class="text-gray-600">09</span><span class="text-gray-500">...</span></div>
				<div class="flex gap-4 mt-8"><span class="text-gray-600">10</span><span class="text-[var(--color-brand)] animate-pulse">█</span></div>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA -->
{#if !data.user}
	<section class="bg-[var(--color-brand)] px-6 py-24 md:py-32 text-center border-b-2 border-black">
		<div class="max-w-4xl mx-auto">
			<h2 class="font-display text-5xl sm:text-7xl font-black uppercase text-white mb-8 leading-[0.9]">
				STOP PAYING FOR<br />BASIC TOOLS.
			</h2>
			<a
				href="/register"
				class="inline-block px-10 py-6 border-2 border-black bg-white text-black text-xl font-mono font-bold uppercase brutal-shadow hover:bg-black hover:text-white transition-colors"
			>
				INITIALIZE STOREFRONT
			</a>
		</div>
	</section>
{/if}
