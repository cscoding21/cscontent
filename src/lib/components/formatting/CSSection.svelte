<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        children: Snippet
        cssClass?: string
    }
    let { children, cssClass }:Props = $props()
</script>

<div class="p-4 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 {cssClass}">
    {@render children()}
</div>