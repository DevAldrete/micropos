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
		"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
		secondary:
			"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm",
		ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-indigo-500",
	};
</script>

<button {type} {disabled} {onclick} class="{base} {variants[variant]} {extraClass}">
	{@render children()}
</button>
