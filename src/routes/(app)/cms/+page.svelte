<script lang="ts">
	import { SectionHeading } from "$lib/components";
	import AddFolder from "./components/AddFolder.svelte";
	import FolderDisplay from './components/FolderDisplay.svelte';

    interface Props {
        data:any
    }
    let { data }:Props = $props()
</script>

<div class="p-4">
    <SectionHeading>Content</SectionHeading>
    <div class="grid grid-cols-3 gap-3">
        {#each data.folders as folder}
            <FolderDisplay {folder} />
        {/each}
    </div>

    <div class="mt-4 w-1/3"><AddFolder {data} parentID={null} /></div>
</div>
