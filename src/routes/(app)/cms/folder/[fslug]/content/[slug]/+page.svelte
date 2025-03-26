<script lang="ts">
	import { CSSection, SectionSubHeading } from "$lib/components";
	import { Accordion, AccordionItem, Badge, Button, ButtonGroup, Datepicker, Input, Label, P, Toggle } from "flowbite-svelte";
	import { CloseCircleSolid, EditOutline, PlusOutline, TrashBinOutline } from "flowbite-svelte-icons";
	import { invalidateAll } from "$app/navigation";
	import InstanceModal from "../../../../components/InstanceModal.svelte";
	import LexicalDisplay from "../../../../components/LexicalDisplay.svelte";

    interface Props {
        data: any,
    }
    let { data }:Props = $props()

    let activeOn = $state(data.content.activeOn) as Date|null
    let expiresOn = $state(data.content.expiresOn) as Date|null
    let isActive = $state(data.content.isActive)
    let selectedVersion = $state(data.versions[0].id)

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
            body: JSON.stringify({ contentID: data.content.id, env: "default" }),
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
        newTagName = ""
        console.log(resp)
    } 

    const delTag = async (tid:string) => {
        const response = await fetch('/cms/actions/tag', {
            method: 'DELETE',
            body: JSON.stringify({ contentID: data.content.id, tag: tid }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        invalidateAll();
        console.log(resp)
    } 

    const delInst = async (id:string) => {
        const response = await fetch('/cms/actions/instance', {
            method: 'DELETE',
            body: JSON.stringify({ instanceID: id }),
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



    let newTagName = $state("")
</script>


<div class="grid grid-cols-3 gap-4 p-4">
    <div class="col-span-1">
        <CSSection>
            <SectionSubHeading>Content Meta Information</SectionSubHeading>
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
                    <Badge class="mr-2" dismissable>
                        {tag.tagID}
                    <button slot="close-button" onclick={() => delTag(tag.tagID)} type="button" class="inline-flex items-center rounded-full p-0.5 my-0.5 ms-1.5 -me-1.5 text-sm text-white dark:text-primary-80 hover:text-whit dark:hover:text-white" aria-label="Remove">
                        <CloseCircleSolid class="h-4 w-4" />
                        <span class="sr-only">Delete tag</span>
                    </button>
                    </Badge>
                {/each}
            </div>

            <div>
                <Label class="mb-2" for="input-addon-sm">Add a tag</Label>
                <ButtonGroup class="w-full" size="sm">
                  <Input name="tag" type="text" placeholder="Tag" bind:value={newTagName} />
                  <Button color="blue"
                    onclick={newTag}
                  >Add</Button>
                </ButtonGroup>
              </div>
        </CSSection>
    </div>

    <div class="col-span-2">
        <CSSection>
            <div class="mb-5">
                <span class="font-semibold text-gray-900 dark:text-white">Versions:</span> 
                {#each data.versions as v}
                    {#if v.isPublished}
                    <Badge class="mr-2" color="green">v{v.number}-{v.env} (published)</Badge>
                    {:else}
                    <button onclick={() => setPub(v.id)}>
                        <Badge class="mr-2" color="yellow">v{v.number}-{v.env}</Badge>
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
            <SectionSubHeading>
                Content instances
                <span class="float-right">
                    <InstanceModal contentID={data.content.id} versionID={selectedVersion}><PlusOutline /></InstanceModal>
                </span>
            </SectionSubHeading>
        
            {#if data.instances.length > 0}
            <Accordion flush>
                {#each data.instances as inst}
                <AccordionItem>
                  <span slot="header">
                    Language: <Badge color="blue">{inst.language}</Badge>   
                    Version: <Badge class="mr-2">v{inst.version.number}</Badge>
                  </span>
                  <div class="text-sm">
                    <LexicalDisplay content={inst.body} id={inst.id} />
                    <div class="mt-2">
                        <button onclick={() => delInst(inst.id)}><TrashBinOutline /></button>

                        <InstanceModal contentID={data.content.id} instanceID={inst.id} contents={inst.body}><EditOutline /></InstanceModal>
                    </div>
                  </div>
                </AccordionItem>
                {/each}
              </Accordion>
            {:else}
            No instances yet
            {/if}
        </CSSection>
    </div>
</div>

