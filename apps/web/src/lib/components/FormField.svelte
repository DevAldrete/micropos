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

<div class="flex flex-col gap-2">
	<label for={id} class="text-xs font-mono font-bold uppercase tracking-widest text-black flex justify-between">
		<span>{label} {#if required}<span class="text-[var(--color-brand)]">*</span>{/if}</span>
		{#if error}
			<span id="{id}-error" class="text-[var(--color-brand)] animate-pulse" role="alert">ERR: {error}</span>
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
		class="brutal-input w-full {error ? 'border-[var(--color-brand)] bg-red-50 text-[var(--color-brand)]' : ''}"
	/>
</div>
