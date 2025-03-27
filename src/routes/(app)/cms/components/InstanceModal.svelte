<script lang="ts">
    import { Button, Label, Modal, Select, type SelectOptionType } from 'flowbite-svelte';
	import { type Snippet } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import LexicalEditor from './LexicalEditor.svelte';

    interface Props {
        contentID: string
        instanceID?: string
        versionID?: string
        contents?: any
        children: Snippet
        update?: Function
    }
    let { contentID, instanceID, versionID, children, contents, update }:Props = $props()

    let modalOpen = $state(false)
    let question = $state("")
    let lang = $state("en-us")
    let editorContents = $state(contents)

    let langOpts :SelectOptionType<string>[] = [
        { value: "en-us", name: "English" }
    ]

    let title = $derived(instanceID ? `Update instance ${instanceID}` : "Create new instance")

    const closeModal = () => {
        modalOpen = false; 
        
        if (update) { 
            update()
        }; 
        
        invalidateAll()
    }

    const updateInt = async () => {
        let data = {
            meta: "",
            contentID: contentID,
            instanceID: instanceID,
            versionID: versionID,
            lang: lang,
            body: editorContents
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
        <div>
            <Select id="select-sm" size="sm" items={langOpts} bind:value={lang} class="mb-6" />
        </div>
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
