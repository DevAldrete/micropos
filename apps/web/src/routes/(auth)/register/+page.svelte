<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import FormField from "$lib/components/FormField.svelte";
	import Button from "$lib/components/Button.svelte";

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Create account — MicroPOS</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md bg-white border-2 border-black p-8 md:p-12 brutal-shadow relative">
		<div class="absolute top-0 right-0 border-b-2 border-l-2 border-black bg-black text-white font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest">
			SYS.INIT
		</div>
		<div class="mb-10 text-center">
			<h1 class="text-4xl font-display font-black uppercase tracking-tight">Initialize<br /><span class="text-[var(--color-brand)]">Account</span></h1>
			<p class="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">Deploy your storefront instance</p>
		</div>

		<form method="POST" use:enhance class="space-y-6">
			{#if form?.error && !form?.field}
				<div
					class="border-2 border-[var(--color-brand)] bg-red-50 px-4 py-3 font-mono text-xs font-bold text-[var(--color-brand)] uppercase"
					role="alert"
				>
					ERR: {form.error}
				</div>
			{/if}

			<FormField
				id="fullName"
				label="System Alias (Full Name)"
				type="text"
				value={form?.fullName ?? ""}
				autocomplete="name"
				required
				error={form?.field === "fullName" ? (form.error ?? null) : null}
			/>

			<FormField
				id="email"
				label="Email Address"
				type="email"
				value={form?.email ?? ""}
				autocomplete="email"
				required
				error={form?.field === "email" ? (form.error ?? null) : null}
			/>

			<FormField
				id="password"
				label="Password"
				type="password"
				autocomplete="new-password"
				required
				error={form?.field === "password" ? (form.error ?? null) : null}
			/>

			<FormField
				id="password_confirmation"
				label="Confirm Password"
				type="password"
				autocomplete="new-password"
				required
				error={form?.field === "password_confirmation" ? (form.error ?? null) : null}
			/>

			<div class="pt-4">
				<Button type="submit" class="w-full">Initialize System</Button>
			</div>
		</form>

		<div class="mt-8 pt-6 border-t-2 border-dashed border-gray-300 text-center font-mono text-xs uppercase font-bold text-gray-500">
			SYSTEM ALREADY ACTIVE?
			<a href="/login" class="ml-2 text-[var(--color-brand)] hover:text-black hover:underline decoration-2 underline-offset-4">
				AUTHENTICATE
			</a>
		</div>
	</div>
</div>
