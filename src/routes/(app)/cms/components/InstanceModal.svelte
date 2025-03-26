<script lang="ts">
	import { theme } from 'svelte-lexical/dist/themes/default';
    import { Button, Label, Modal, Select, type SelectOptionType } from 'flowbite-svelte';
	import { RichTextComposer } from 'svelte-lexical';
	import { onMount, type Snippet } from 'svelte';

    interface Props {
        contentID: string
        instanceID?: string
        versionID?: string
        contents?: any
        children: Snippet
    }
    let { contentID, instanceID, versionID, children, contents }:Props = $props()

    let modalOpen = $state(false)
    let question = $state("")
    let lang = $state("en-us")

    let composer:any

    let langOpts :SelectOptionType<string>[] = [
        { value: "en-us", name: "English" }
    ]

    const updateInt = async () => {
        const json = composer.getEditor().getEditorState().toJSON()

        let data = {
            contentID: contentID,
            instanceID: instanceID,
            versionID: versionID,
            lang: lang,
            body: json
        }

        console.log(data)

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
            console.log(resp)
        }
    }

    onMount(() => {
        console.log("contents", contents)
        console.log("composer", composer)
        if(composer && composer.getEditor) {
            const editor = composer.getEditor()

            if(contents) {
                editor.setEditorState(editor.parseEditorState(contents))
            }
        }
    })
</script>


<button onclick={() => (modalOpen = true)}>{@render children()}</button>
<Modal size="xl" title="Create New Instance" bind:open={modalOpen}>
    <div class="flex">
        <div>
            <Select id="select-sm" size="sm" items={langOpts} bind:value={lang} class="mb-6" />
        </div>
    </div>
    <div class="flex">
        <div>
            <RichTextComposer bind:this={composer} theme={theme} />
        </div>
        <div class="ml-4 w-full">
            <Label>AI Collaboration</Label>
            <textarea name="intent" bind:value={question} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Intent"></textarea>
        </div>
    </div>
  <svelte:fragment slot="footer">
    <Button onclick={updateInt}>Update</Button>
    <Button color="alternative">Close</Button>
  </svelte:fragment>
</Modal>
