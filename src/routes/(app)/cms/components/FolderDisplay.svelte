<script lang="ts">
    import { enhance } from "$app/forms";
	import { CSSection } from "$lib/components";
	import SectionSubHeading from "$lib/components/formatting/SectionSubHeading.svelte";
    import type { Folder } from "@prisma/client";
	import { FolderOutline } from "flowbite-svelte-icons";

    interface Props {
        folder: Folder
    }
    let { folder }:Props = $props()

</script>

<CSSection>
    <SectionSubHeading>
        <FolderOutline class="float-left mr-4" />
        <a href="/cms/folder/{folder.slug}">{folder.name}</a>
    </SectionSubHeading>

    {#if folder.parentID != null}
        <div class="text-sm">Parent: <b>{folder.parentID}</b></div>
    {/if}

    <div class="text-sm">Created by: <b>{folder.createdBy}</b></div>
    <form method="POST" action="/cms/folder/?/delFold" use:enhance>
        <input type="hidden" name="id" value={folder.id} />
        <button type="submit" class="text-orange-400">delete</button>
    </form>
</CSSection>