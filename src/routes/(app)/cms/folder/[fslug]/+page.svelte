<script lang="ts">
	import { CSSection, PageHeading, SectionSubHeading } from "$lib/components";
	import { Alert, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import AddFolder from "../../components/AddFolder.svelte";
	import FolderDisplay from "../../components/FolderDisplay.svelte";
	import { CheckCircleSolid, CircleMinusSolid, PlusOutline } from "flowbite-svelte-icons";

    interface Props {
        data: any
    }
    let { data }:Props = $props() 

</script>


<div class='p-4'>
    <PageHeading title={"Folder: " + data.folder.name}></PageHeading>
        <div class="grid grid-cols-3 gap-4">
            <div class="">
                <SectionSubHeading>Child Folders</SectionSubHeading>
                {#if data.folder.folders}
                <ul>
                {#each data.folder.folders as subFolder}
                    <li class="mb-2">
                        <FolderDisplay folder={subFolder} />
                    </li>
                {/each}
                </ul>
                {:else}
                    <Alert>
                        This folder has no subfolders
                    </Alert>
                {/if}

                <div class="mt-4"><AddFolder {data} parentID={data.folder.id} /></div>
            </div>
            <div class="col-span-2">

            <CSSection>
                
                <SectionSubHeading>
                    Content
                    <a class="button float-right" href="/cms/folder/{data.folder.slug}/content"><PlusOutline /></a>
                </SectionSubHeading>

            
                <div class="mt-4">
                {#if data.folder.content.length > 0}
                    <Table>
                        <TableHead>
                            <TableHeadCell>Content</TableHeadCell>
                            <TableHeadCell>Tags</TableHeadCell>
                            <TableHeadCell>Active</TableHeadCell>
                            <TableHeadCell>Active Date</TableHeadCell>
                            <TableHeadCell>Expire Date</TableHeadCell>
                            <TableHeadCell>
                                <span class="sr-only">Edit</span>
                            </TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {#each data.folder.content as c}
                            <TableBodyRow>
                                <TableBodyCell><a href="/cms/folder/{data.folder.slug}/content/{c.slug}">{c.title}</a></TableBodyCell>
                                <TableBodyCell></TableBodyCell>
                                <TableBodyCell class="content-center">
                                    {#if c.isActive}
                                        <CheckCircleSolid color="green" />
                                    {:else}
                                        <CircleMinusSolid color="gray" />
                                    {/if}
                                </TableBodyCell>
                                <TableBodyCell>{c.activeOn}</TableBodyCell>
                                <TableBodyCell>{c.expiresOn}</TableBodyCell>
                                <TableBodyCell></TableBodyCell>
                            </TableBodyRow>
                            {/each}
                        </TableBody>
                    </Table>
                {:else}
                    No content yet
                {/if}
            
                </div>

            </CSSection>            
            </div>
        </div>

</div>