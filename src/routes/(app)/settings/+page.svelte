<script lang="ts">
	import { CSSection } from "$lib/components";
	import { formatDate } from "$lib/utils/format";
	import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Badge, Button, Modal, Input, Label, Textarea, Alert} from "flowbite-svelte";
	import { CheckCircleSolid, CircleMinusSolid, FileCopyOutline, TrashBinOutline } from "flowbite-svelte-icons";
    import Breadcrumbs from "../cms/components/Breadcrumbs.svelte";
	import { invalidateAll } from "$app/navigation";
    import { copy } from 'svelte-copy';
    import { addToast } from "$lib/stores/toasts";

    interface Props {
        data: any
    }
    let { data }:Props = $props()

    let addModal = $state(false);
    let newName = $state("")
    let createdKey = $state("")
    let createdID = $state("")

    const newKey = async () => {
        const response = await fetch('/settings/', {
            method: 'POST',
            body: JSON.stringify({ name: newName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let r = await response.json()
        newName = ""
        createdKey = r.resp.key
        createdID = r.resp.id
        invalidateAll()
    }

    const delKey = async (id:string) => {
        const response = await fetch('/settings/', {
            method: 'DELETE',
            body: JSON.stringify({ id: id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        newName = ""
        invalidateAll()
    }

    const closeModal = () => {
        addModal = false
        newName = ""
        createdKey = ""
    }

</script>

<Breadcrumbs pageDetail="API Keus" />

<div class="p-4">
    <CSSection>
        <div>
            <button onclick={() => { addModal = true }}>New Key</button>
            <Modal title="Generate a New API Key" bind:open={addModal} on:close={closeModal}>
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    To connect securely to csContent, your tool or application needs an API key with permission to access the appropriate resources.</p>

                {#if createdKey}
                    <Label>Client ID</Label>
                    <div class="">{createdID}</div>

                    <Label>API Key</Label>
                    <Textarea bind:value={createdKey} />
                    <Alert>Make sure to copy this key before exiting this window.  It will not be available again.</Alert>
                {:else}
                <Label>Key Name</Label>
                <Input bind:value={newName} />
                {/if}

                <svelte:fragment slot="footer">
                    {#if createdKey}
                        <button 
                            class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            type="button"
                            use:copy={{
                            text: createdKey,
                            events: ['click'],
                            onCopy({ text, event }) {
                                addToast({dismissible: true, message: "Key copied successfully", type: "success" });
                            },
                            onError({ error, event }) {
                                addToast({dismissible: true, message: error.message, type: "error"});
                            }
                        }}>
                            <FileCopyOutline class="mr-2" />
                            Copy to Clipboard
                        </button>
                        <button 
                            class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            type="button"
                            onclick={closeModal}>Close</button>
                    {:else}
                        <Button onclick={newKey}>Create Key</Button>
                        <Button color="alternative" onclick={closeModal}>Cancel</Button>
                    {/if}
                </svelte:fragment>
                
              </Modal>
        </div>
        {#if data.keys && data.keys.length > 0}
        <Table>
            <TableHead>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Client ID</TableHeadCell>
                <TableHeadCell>Key</TableHeadCell>
                <TableHeadCell>Active</TableHeadCell>
                <TableHeadCell>Expires On</TableHeadCell>
                <TableHeadCell>
                    <span class="sr-only">Actions</span>
                </TableHeadCell>
            </TableHead>
            <TableBody>
                {#each data.keys as key}
                <TableBodyRow>
                    <TableBodyCell>{key.name}</TableBodyCell>
                    <TableBodyCell>
                        {key.id}
                        <button 
                            class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            type="button"
                            use:copy={{
                                text: createdID,
                                events: ['click'],
                                onCopy({ text, event }) {
                                    addToast({dismissible: true, message: "Client ID copied successfully", type: "success" });
                                },
                                onError({ error, event }) {
                                    addToast({dismissible: true, message: error.message, type: "error"});
                                }
                            }}>
                            <FileCopyOutline class="mr-2" />
                        </button>
                    </TableBodyCell>
                    <TableBodyCell>******************{key.keyindicator}</TableBodyCell>
                    <TableBodyCell>
                        {#if key.isActive}
                            <CheckCircleSolid class="justify-center" color="green" />
                        {:else}
                            <CircleMinusSolid class="justify-center" color="gray" />
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell class="content-center">{formatDate(key.expiresOn)}</TableBodyCell>
                    <TableBodyCell>
                        <button onclick={() => delKey(key.id)}>
                            <TrashBinOutline />
                        </button>
                    </TableBodyCell>
                </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
        {/if}
    </CSSection>
</div>