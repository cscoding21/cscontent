<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		cssClass?: string;
	}
	let { children, cssClass }: Props = $props();
</script>

<Heading tag="h6" class="text-md dark:text-gray-300 text-gray-600 {cssClass}">
	{#if children}
		{@render children()}
	{/if}
</Heading>
<Hr hrClass="h-px mt-2 mb-2 bg-gray-200 border-0 dark:bg-gray-700" />