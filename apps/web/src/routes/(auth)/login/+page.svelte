<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import FormField from "$lib/components/FormField.svelte";
	import Button from "$lib/components/Button.svelte";

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Sign in — MicroPOS</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
			<p class="mt-2 text-sm text-gray-500">Sign in to your MicroPOS account</p>
		</div>

		<form method="POST" use:enhance class="space-y-5">
			{#if form?.error && !form?.field}
				<div
					class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
					role="alert"
				>
					{form.error}
				</div>
			{/if}

			<FormField
				id="email"
				label="Email"
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
				autocomplete="current-password"
				required
				error={form?.field === "password" ? (form.error ?? null) : null}
			/>

			<Button type="submit" class="w-full">Sign in</Button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-500">
			Don't have an account?
			<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
				Create one
			</a>
		</p>
	</div>
</div>
