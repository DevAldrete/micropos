<script lang="ts">
	interface Props {
		id: string;
		label: string;
		type?: "text" | "email" | "password";
		value?: string;
		autocomplete?: HTMLInputElement["autocomplete"];
		required?: boolean;
		error?: string | null;
	}

	let {
		id,
		label,
		type = "text",
		value = $bindable(""),
		autocomplete,
		required = false,
		error = null,
	}: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500" aria-hidden="true">*</span>
		{/if}
	</label>
	<input
		{id}
		name={id}
		{type}
		bind:value
		{autocomplete}
		{required}
		aria-invalid={error ? "true" : undefined}
		aria-describedby={error ? `${id}-error` : undefined}
		class="rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
		       {error
			? 'border-red-400 bg-red-50 focus:ring-red-400'
			: 'border-gray-300 bg-white focus:border-indigo-400'}"
	/>
	{#if error}
		<p id="{id}-error" class="text-xs text-red-600" role="alert">{error}</p>
	{/if}
</div>
