<script lang="ts">
    import { Badge, Button, Input, Label, Modal, Select, type SelectOptionType } from 'flowbite-svelte';
	import { type Snippet } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import LexicalEditor from './LexicalEditor.svelte';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';

    interface Props {
        contentID: string
        instanceID?: string
        versionID?: string
        contents?: any
        children: Snippet
        update?: Function
        meta?: string
        selectors?: any[]
    }
    let { contentID, instanceID, versionID, children, contents, update, meta, selectors }:Props = $props()

    let modalOpen = $state(false)
    let question = $state("")
    let lang = $state("en-us")
    let editorMeta = $state(meta)
    let editorContents = $state(contents)
    let editorSelectors = $state(selectors)

    let newSelectorKey:string = $state("")
    let newSelectorValue:string = $state("")

    let langOpts :SelectOptionType<string>[] = [
        { value: "en-us", name: "English" }
    ]

    let title = $derived(instanceID ? `Update instance ${instanceID}` : "Create new instance")

    const addSelector = () => {
        let s:any = {}
        s[newSelectorKey] = newSelectorValue

        editorSelectors = [...editorSelectors as any[], s]

        newSelectorKey = ""
        newSelectorValue = ""
    }

    const removeSelector = (index:number) => {
        if(!editorSelectors)
            return;

        delete editorSelectors[index]
    }

    const closeModal = () => {
        modalOpen = false; 
        
        if (update) { 
            update()
        }; 
        
        invalidateAll()
    }

    const updateInt = async () => {
        let data = {
            meta: editorMeta,
            contentID: contentID,
            instanceID: instanceID,
            versionID: versionID,
            body: editorContents,
            selectors: editorSelectors
        }

        if (instanceID) {
            //---edit an existing instance
            data.instanceID = instanceID

            const response = await fetch('/cms/actions/instance', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let resp = await response.json()
            console.log("update resp", resp)
            invalidateAll()
        } else {
            //---create a new instance
            const response = await fetch('/cms/actions/instance', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let resp = await response.json()
            instanceID = resp.resp.id
            invalidateAll()
        }
    }
</script>


<button onclick={() => (modalOpen = true)}>{@render children()}</button>
<Modal size="xl" title={title} bind:open={modalOpen} onclose={closeModal}>
    <div class="flex">
        <!-- <div class="mr-2">
            <Select id="select-sm" size="sm" items={langOpts} bind:value={lang} class="text-xs" />
        </div> -->
        <div>
            <Input id="label-sm" size="sm" bind:value={editorMeta} placeholder="Add a meta label" class="text-xs" />
        </div>
        <div class="mr-4 ml-12">
            <Input id="selectorKey" size="sm" bind:value={newSelectorKey} placeholder="Key" />
        </div>  
        <div>
            <Input id="selectorKey" size="sm" bind:value={newSelectorValue} placeholder="Value" />
        </div>
        <div class="ml-4">
            <Button pill color="blue" size="sm" onclick={addSelector}>Add</Button>
        </div>
        {#if editorSelectors}
        <div class="ml-4">
            Selectors: 
            {#each editorSelectors as selector, index}
                {#each Object.keys(selector) as k}
                    <Badge class="mx-2" dismissable>
                        {k} : {selector[k]} 
                        <button slot="close-button" onclick={() => removeSelector(index)} type="button" class="inline-flex items-center rounded-full p-0.5 my-0.5 ms-1.5 -me-1.5 text-sm text-white dark:text-primary-80 hover:text-whit dark:hover:text-white" aria-label="Remove">
                            <CloseCircleSolid class="h-4 w-4" />
                            <span class="sr-only">Delete instance selector '{k}'</span>
                        </button>
                    </Badge>
                {/each}
            {/each}
        </div>  
        {/if}
    </div>
    <div class="flex">
        <div>
            <LexicalEditor id={instanceID || crypto.randomUUID()} bind:contents={editorContents} />
        </div>
        <div class="ml-4 w-full">
            <Label>AI Collaboration</Label>
            <textarea name="intent" bind:value={question} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Intent"></textarea>
        </div>
    </div>
  <svelte:fragment slot="footer">
    <Button onclick={updateInt}>Update</Button>
    <Button color="alternative" onclick={closeModal}>Close</Button>
  </svelte:fragment>
</Modal>
