<script lang="ts">
	import type { Folder } from "@prisma/client";
	import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
	import type { Snippet } from "svelte";


    interface Props {
        links?: Folder[],
        pageDetail?: string,
        topLevelLink?: string,
        topLevelName?: string,
        children?: Snippet
    }
    let { links, children, pageDetail, topLevelLink, topLevelName }:Props = $props()
</script>

<div class="grid w-full grid-cols-4">
	<div class="col-span-2 justify-start p-2">
		<Breadcrumb aria-label="Solid background breadcrumb example">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
            {#if topLevelName}
			    <BreadcrumbItem href={topLevelLink}>{topLevelName}</BreadcrumbItem>
            {/if}
            {#if links  && links.length > 0}
                {#each links as link}
                    <BreadcrumbItem href="/cms/folder/{link.slug}">{link.name}</BreadcrumbItem>
                {/each}
            {/if}

			{#if pageDetail}
				<BreadcrumbItem><b>{pageDetail}</b></BreadcrumbItem>
			{/if}
		</Breadcrumb>
	</div>
	<div>&nbsp;</div>
	<div class="justify-self-end p-2">
		{#if children}{@render children()}{/if}
	</div>
</div>

