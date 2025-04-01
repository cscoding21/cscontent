<script lang="ts">
	import { CSSection } from "$lib/components";
	import { formatDate } from "$lib/utils/format";
	import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Badge, Button, Modal, Input, Label} from "flowbite-svelte";
	import { CheckCircleSolid, CircleMinusSolid, TrashBinOutline } from "flowbite-svelte-icons";
    import Breadcrumbs from "../cms/components/Breadcrumbs.svelte";
	import { invalidateAll } from "$app/navigation";

    interface Props {
        data: any
    }
    let { data }:Props = $props()

    let addModal = $state(false);
    let newName = $state("")

    const newKey = async () => {
        const response = await fetch('/settings/', {
            method: 'POST',
            body: JSON.stringify({ name: newName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        newName = ""
        console.log(resp)
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

        let resp = await response.json()
        newName = ""
        console.log(resp)
        invalidateAll()
    }

</script>

<Breadcrumbs pageDetail="API Keus" />

<div class="p-4">
    <CSSection>
        <div>
            <button onclick={() => { addModal = true }}>New Key</button>
            <Modal title="Terms of Service" bind:open={addModal} autoclose>
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">To connect securely to Flowbite Web Services, your tool or application needs an API key with permission to access resources such as Flowbite S3 bucket.</p>

                <Label>Key Name</Label>
                <Input bind:value={newName} />
                <svelte:fragment slot="footer">
                  <Button onclick={newKey}>Create Key</Button>
                  <Button color="alternative">Decline</Button>
                </svelte:fragment>
              </Modal>
        </div>
        {#if data.keys && data.keys.length > 0}
        <Table>
            <TableHead>
                <TableHeadCell>Name</TableHeadCell>
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
                    <TableBodyCell>{key.key}</TableBodyCell>
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