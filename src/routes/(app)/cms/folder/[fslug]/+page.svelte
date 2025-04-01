<script lang="ts">
	import { CSSection, SectionSubHeading } from "$lib/components";
	import { Alert, Badge, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import AddFolder from "../../components/AddFolder.svelte";
	import FolderDisplay from "../../components/FolderDisplay.svelte";
	import { CheckCircleSolid, CircleMinusSolid, PlusOutline } from "flowbite-svelte-icons";
	import { formatDate } from "$lib/utils/format";
	import Breadcrumbs from "../../components/Breadcrumbs.svelte";

    interface Props {
        data: any
    }
    let { data }:Props = $props() 

</script>

<Breadcrumbs links={data.folderTree} topLevelLink="/cms" topLevelName="Content" />

<div class='p-4'>
        <div class="grid grid-cols-3 gap-4">
            <div class="">
            <CSSection>
                <SectionSubHeading>Child Folders</SectionSubHeading>
                {#if data.folder.folders && data.folder.folders.length > 0}
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
            </CSSection>

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
                                <TableBodyCell>
                                    {#each c.tags as tag}
                                        <Badge class="mr-2">{tag.tagID}</Badge>
                                    {/each}
                                </TableBodyCell>
                                <TableBodyCell>
                                    {#if c.isActive}
                                        <CheckCircleSolid class="justify-center" color="green" />
                                    {:else}
                                        <CircleMinusSolid class="justify-center" color="gray" />
                                    {/if}
                                </TableBodyCell>
                                <TableBodyCell class="content-center">{formatDate(c.activeOn)}</TableBodyCell>
                                <TableBodyCell class="content-center">{formatDate(c.expiresOn)}</TableBodyCell>
                                <TableBodyCell class="content-center"></TableBodyCell>
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