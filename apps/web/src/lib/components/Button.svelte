<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		type?: "submit" | "button" | "reset";
		variant?: "primary" | "secondary" | "ghost";
		disabled?: boolean;
		class?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let {
		type = "button",
		variant = "primary",
		disabled = false,
		class: extraClass = "",
		children,
		onclick,
	}: Props = $props();

	const base =
		"inline-flex items-center justify-center border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-[var(--color-brand)] text-white brutal-shadow hover:bg-black",
		secondary:
			"bg-white text-black brutal-shadow hover:bg-gray-100",
		ghost: "border-transparent hover:text-[var(--color-brand)] hover:bg-black/5 underline decoration-2 underline-offset-4",
	};
</script>

<button {type} {disabled} {onclick} class="{base} {variants[variant]} {extraClass}">
	{@render children()}
</button>
