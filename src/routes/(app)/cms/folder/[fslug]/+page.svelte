<script lang="ts">
	import { PageHeading, SectionSubHeading } from "$lib/components";
	import AddFolder from "../../components/AddFolder.svelte";
	import FolderDisplay from "../../components/FolderDisplay.svelte";

    interface Props {
        data: any
    }
    let { data }:Props = $props() 

</script>


<div class='p-4'>
    <PageHeading title={"Folder: " + data.folder.name}></PageHeading>
        <!-- <code>{JSON.stringify(data.folder)}</code> -->
        <div class="flex">
            <div class="flex-none mr-8 w-1/3">
                <SectionSubHeading>Child Folders</SectionSubHeading>
                {#if data.folder.folders}
                <ul>
                {#each data.folder.folders as subFolder}
                    <li class="mb-2">
                        <FolderDisplay folder={subFolder} />
                    </li>
                {/each}
                </ul>
                {/if}

                <div class="mt-4"><AddFolder {data} parentID={data.folder.id} /></div>
            </div>
            <div class="flex-none  w-2/3">
                <SectionSubHeading>Content</SectionSubHeading>

                <div class="mt-4">
                    <ul>
                    {#each data.folder.content as c}
                        <li><a href="/cms/folder/{data.folder.slug}/content/{c.slug}">{c.title}</a></li>
                    {/each}
                    </ul>
                </div>

                <a href="/cms/folder/{data.folder.slug}/content">Add new content</a>
            </div>
        </div>

</div>