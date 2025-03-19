<script lang="ts">
    import { page } from "$app/state";
	import { CSSection } from "$lib/components";
	import { superForm } from "sveltekit-superforms";
    import { debounce } from '$lib/forms/helpers';

    interface Props {
        data: any,
        parentID: string
    }
    let { data, parentID }:Props = $props()

    const { form, errors, message, enhance } = superForm(data.form);
    const {
		delayed,
		submit: submitCheckUsername,
		enhance: submitEnhance
	} = superForm(
		{ name: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$form.name) cancel();
			},
			onUpdated({ form }) {
				// Update the other form to show the error message
				$errors.name = form.errors.name;
			}
		}
	);

    const checkFolder = debounce(submitCheckUsername, 200);

</script>

<CSSection>
{#if $message}
    <!-- eslint-disable-next-line svelte/valid-compile -->
    <div class="status" class:error={page.status >= 400} class:success={page.status == 200}>
        {$message}
    </div>
{/if}
<form method="POST" class="mx-auto" action="/content/content/?/addCont" use:enhance>
    <input type="hidden" name="parentID" value={parentID} />
    <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add new content</label>
        <input form="check" name="title" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.title} oninput={checkFolder} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Content title" />
        {#if $errors.name}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.name}</p>{/if}

        <input type="hidden" name="title" value={$form.title} />
    </div>

    <div class="mb-5">
        <label for="intent" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content intent</label>
        <textarea name="intent" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.intent}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Intent"></textarea>
        {#if $errors.intent}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.intent}</p>{/if}
    </div>

    <div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
    </div>
</form>

<form id="check" method="POST" action="/content/content/?/check" use:submitEnhance></form>
</CSSection>