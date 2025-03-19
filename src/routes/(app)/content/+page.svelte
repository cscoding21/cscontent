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
    <div class="flex">
        <div class="flex-none w-1/3">
            <SectionHeading>Content</SectionHeading>
            <ul>
                {#each data.folders as folder}
                    <li class="w-full mb-2">
                        <FolderDisplay {folder} />
                    </li>
                {/each}
            </ul>

            <div class="mt-4"><AddFolder {data} parentID={null} /></div>
        </div>
    </div>
</div>
