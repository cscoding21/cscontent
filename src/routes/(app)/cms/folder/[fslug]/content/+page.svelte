<script lang="ts">
	import { page } from "$app/state";
	import { CSSection } from "$lib/components";
	import { debounce } from "$lib/forms/helpers";
	import { FolderOutline } from "flowbite-svelte-icons";
	import { RichTextComposer } from "svelte-lexical";
    import {theme} from 'svelte-lexical/dist/themes/default';
	import { superForm } from "sveltekit-superforms";

    interface Props {
        data: any,
    }
    let { data }:Props = $props()

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

    const checkContent = debounce(submitCheckContentTitle, 200);
</script>


<div class="p-4">
    <CSSection>
        <h2><FolderOutline class="float-left mr-2" /> <a href="/cms/folder/{data.folder.slug}">{data.folder.name}</a></h2>
    
        <div class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3">Content info</div>
        {#if data.content}
            <h2>{data.content.id}</h2>
            <h2>{data.content.slug}</h2>
        {/if}
    </CSSection>
    
    <CSSection cssClass="mt-2 mb-4">
    {#if $message}
        <!-- eslint-disable-next-line svelte/valid-compile -->
        <div class="status" class:error={page.status >= 400} class:success={page.status == 200}>
            {$message}
        </div>
    {/if}
    <form method="POST" class="mx-auto" action="/cms/folder/{data.folder.slug}/content/?/addCont" use:enhance>
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
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
        </div>
    </form>
    
    <form id="check" method="POST" action="/cms/folder/{data.folder.slug}/content/?/check" use:submitEnhance></form>
    </CSSection>
</div>  