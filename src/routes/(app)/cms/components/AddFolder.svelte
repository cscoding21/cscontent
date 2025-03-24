<script lang="ts">
    import { page } from "$app/state";
	import { CSSection } from "$lib/components";
	import { superForm } from "sveltekit-superforms";
    import { debounce } from '$lib/forms/helpers';
	import { Button, ButtonGroup, Input, InputAddon, Label } from "flowbite-svelte";

    interface Props {
        data: any,
        parentID: string|null
    }
    let { data, parentID }:Props = $props()

    const { form, errors, message, enhance, submit } = superForm(data.form);
    const {
		delayed,
		submit: submitCheckFolderName,
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

    const checkFolder = debounce(submitCheckFolderName, 200);
    const checkEnter = ((event:KeyboardEvent) => {
        if(event.key === "Enter") {
            submit()
        }
    })

</script>

<CSSection>
{#if $message}
    <!-- eslint-disable-next-line svelte/valid-compile -->
    <div class="status" class:error={page.status >= 400} class:success={page.status == 200}>
        {$message}
    </div>
{/if}
<form method="POST" class="" action="/cms/folder/?/addFold" use:enhance>
    <input type="hidden" name="parentID" value={parentID} />

    <div>
        <Label class="mb-2" for="input-addon-sm">Create a new folder</Label>
        <ButtonGroup class="w-full" size="sm">
          <Input form="check" name="name" type="text" placeholder="Folder name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name} oninput={checkFolder} onkeypress={checkEnter} />
          <Button color="blue" type="submit">Add</Button>
        </ButtonGroup>
        <input type="hidden" name="name" value={$form.name} />
      </div>
      {#if $errors.name}<p class="mt-2 text-sm text-red-600 dark:text-red-500">{$errors.name}</p>{/if}
</form>

<form id="check" method="POST" action="/cms/folder/?/check" use:submitEnhance></form>
</CSSection>