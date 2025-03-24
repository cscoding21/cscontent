<script lang="ts">
    import { page } from "$app/state";
	import { CSSection, SectionSubHeading } from "$lib/components";
	import { superForm } from "sveltekit-superforms";
    import { debounce } from '$lib/forms/helpers';
	import { Accordion, AccordionItem, Badge, Button, ButtonGroup, Datepicker, Input, Label, P, Toggle } from "flowbite-svelte";
	import { PlusOutline , FolderOutline} from "flowbite-svelte-icons";
	import { invalidateAll } from "$app/navigation";
	import { contentNameAvailable } from "$lib/services/cms/content";
	import { RichTextComposer } from "svelte-lexical";
	import { theme } from "svelte-lexical/dist/themes/default";

    interface Props {
        data: any,
    }
    let { data }:Props = $props()

    let activeOn = $state(data.content.activeOn) as Date|null
    let expiresOn = $state(data.content.expiresOn) as Date|null
    let isActive = $state(data.content.isActive)

    const { form, errors, message, enhance } = superForm(data.form, { dataType: 'form' });
    const {
		delayed,
		submit: submitCheckContentTitle,
		enhance: submitEnhance
	} = superForm(
		{ title: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$form.title) cancel();
			},
			onUpdated({ form }) {
				// Update the other form to show the error message
				$errors.title = form.errors.title;
			}
		}
	);

    const updateCont = async () => {
        const ct = {
            id: data.content.id,
            title: data.content.title,
            intent: data.content.intent,
            isActive: isActive,
            activeOn: activeOn,
            expiresOn: expiresOn
        }

        const response = await fetch('/cms/actions/content', {
            method: 'PUT',
            body: JSON.stringify(ct),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        invalidateAll();
        console.log(resp)
    }

    const newVer = async () => {
        const response = await fetch('/cms/actions/version', {
            method: 'POST',
            body: JSON.stringify({ contentID: data.content.id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        invalidateAll();
        console.log(resp)
    } 

    const newTag = async () => {
        const response = await fetch('/cms/actions/tag', {
            method: 'POST',
            body: JSON.stringify({ contentID: data.content.id, tag: newTagName }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        invalidateAll();
        console.log(resp)
    } 

    const setPub = async (vid:string) => {
        if(confirm(`This will publish ${vid} and de-publish all other versions.  Do you want to proceed?`)) {
            const response = await fetch('/cms/actions/version', {
                method: 'PUT',
                body: JSON.stringify({ contentID: data.content.id, versionID: vid }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let resp = await response.json()
            invalidateAll();
            console.log(resp)
        }
    } 

    const checkContent = debounce(submitCheckContentTitle, 200);
    let newTagName = $state("")
</script>


<div class="grid grid-cols-3 gap-4 p-4">
    <div class="col-span-1">
        <CSSection>
            <SectionSubHeading cssClass="mt-6">Content Meta Information</SectionSubHeading>
            <div class="col-span-12 2xl:col-span-4">
                <div class="mb-4 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:space-y-6 md:p-6">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{data.content.title}</h2>
                  <!-- List -->
                  <ul class="list-inside text-gray-500 dark:text-gray-400">
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 pb-4 dark:border-gray-700">
                        <p class="font-semibold text-gray-900 dark:text-white">ID</p>
                        <p class="text-end">{data.content.id}</p>
                    </li>
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 py-4 dark:border-gray-700">
                        <p class="font-semibold text-gray-900 dark:text-white">Folder</p>
                        <p class="text-end"><a href="/cms/folder/{data.folder.slug}">{data.folder.name}</a></p>
                      </li>
                    
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 py-4 dark:border-gray-700">
                      <p class="font-semibold text-gray-900 dark:text-white">Slug</p>
                      <p class="text-end">{data.content.slug}</p>
                    </li>
                    <li class="items-center justify-between gap-8 border-b border-gray-200 py-4 dark:border-gray-700">
                      <p class="font-semibold text-gray-900 dark:text-white">Intent</p>
                      <p class="text-sm font-light">{data.content.intent}</p>
                    </li>
                    </ul>   
                </div>
            </div>
            

            <SectionSubHeading cssClass="mt-6">Publishing</SectionSubHeading>

            <Label class="mb-2" for="input-addon-sm">Set a date range (optional)</Label>
            <Datepicker range bind:rangeFrom={activeOn} bind:rangeTo={expiresOn} />
            <div class="col-span-12 2xl:col-span-4">
                <div class="mb-4 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:space-y-6 md:p-6">
                <ul class="list-inside text-gray-500 dark:text-gray-400">
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 pb-4 dark:border-gray-700">
                        <p class="font-semibold text-gray-900 dark:text-white">Active on</p>
                        <p class="text-end">{activeOn ? activeOn.toLocaleDateString() : 'Availalble now'}</p>
                    </li>
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 py-4 dark:border-gray-700">
                        <p class="font-semibold text-gray-900 dark:text-white">Expires on</p>
                        <p class="text-end">{expiresOn ? expiresOn.toLocaleDateString() : 'Never expires'}</p>
                    </li>
                    <li class="flex items-center justify-between gap-8 border-b border-gray-200 py-4 dark:border-gray-700">
                        <p class="font-semibold text-gray-900 dark:text-white">Is Active</p>
                        <p class="text-end"><Toggle color="blue" bind:checked={isActive}></Toggle></p>
                    </li>
                </ul>
                <button onclick={updateCont}>Update</button>
                </div>  
            </div>  

            <SectionSubHeading cssClass="mt-6">Tags</SectionSubHeading>

            <div class="p-2 mb-3">
                {#each data.tags as tag} 
                    <Badge class="mr-2">{tag.tagID}</Badge>
                {/each}
            </div>

            <div>
                <Label class="mb-2" for="input-addon-sm">Add a tag</Label>
                <ButtonGroup class="w-full" size="sm">
                  <Input name="tag" type="text" placeholder="Tag" aria-invalid={$errors.name ? 'true' : undefined} bind:value={newTagName} />
                  <Button color="blue"
                    onclick={newTag}
                  >Add</Button>
                </ButtonGroup>
                <input type="hidden" name="name" value={$form.name} />
              </div>
              <!-- {#if $errors.name}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.name}</p>{/if} -->

        </CSSection>
    </div>

    <div class="col-span-2">
        <CSSection>
            <div class="mb-5">
                <span class="font-semibold text-gray-900 dark:text-white">Versions:</span> 
                {#each data.versions as v}
                    {#if v.isPublished}
                    <Badge class="mr-2" color="green">v{v.number} (published)</Badge>
                    {:else}
                    <button onclick={() => setPub(v.id)}>
                        <Badge class="mr-2" color="yellow">v{v.number}</Badge>
                    </button>
                    {/if}
                {/each}
        
                <Button 
                    size="xs" 
                    color="dark"
                    onclick={newVer}
                    ><PlusOutline class="w-4 h-4 me-2" />Create version
                </Button>
            </div>
        </CSSection>
        <CSSection cssClass="mt-4">
            <SectionSubHeading>Content instances</SectionSubHeading>
        
            {#if data.instances.length > 0}
            <Accordion flush>
                {#each data.instances as inst}
                <AccordionItem>
                  <span slot="header">
                    Language: <Badge color="blue">{inst.language}</Badge>   
                    <span>Version: <Badge class="mr-2">v{inst.version.number}</Badge></span>
                  <p class="mt-2 text-sm font-light text-gray-500 dark:text-gray-400">{inst.body}</p>
                </AccordionItem>
                {/each}
              </Accordion>
            {:else}
            No instances yet
            {/if}
        </CSSection>

        <CSSection cssClass="mt-4">
            <RichTextComposer {theme} />
        </CSSection>
    </div>
</div>


<!--
<CSSection cssClass="mt-2 mb-4">
{#if $message}
    <!-- eslint-disable-next-line svelte/valid-compile --
    <div class="status" class:error={page.status >= 400} class:success={page.status == 200}>
        {$message}
    </div>
{/if}
<form method="POST" class="mx-auto" action="/cms/folder/{data.folder.slug}/content/?/updateCont" use:enhance>
    <input type="hidden" name="id" value={data.content.id} />
    <input type="hidden" name="versionID" value={data.content.versionID} />
    <input type="hidden" name="parentID" value={data.folder.id} />
    <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content title </label>
        <input form="check" name="title" aria-invalid={$errors.title ? 'true' : undefined} bind:value={$form.title} oninput={checkContent} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Content title" />
        {#if $errors.title}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.title}</p>{/if}

        <input type="hidden" name="title" value={$form.title} />
    </div>

    <div class="mb-5">
        <label for="intent" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content intent</label>
        <textarea name="intent" aria-invalid={$errors.intent ? 'true' : undefined} bind:value={$form.intent}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Intent"></textarea>
        {#if $errors.intent}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.intent}</p>{/if}
    </div>

    <div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
    </div>
</form>

<form id="check" method="POST" action="/cms/folder/{data.folder.slug}/content/?/check" use:submitEnhance></form>
</CSSection>
-->
