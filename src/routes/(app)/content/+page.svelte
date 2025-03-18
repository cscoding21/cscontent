<script lang="ts">
	import { CSSection, SectionHeading } from "$lib/components";
    import { enhance } from '$app/forms';

    interface Props {
        data:any
    }
    let { data }:Props = $props()
</script>

<div class="p-4">
<CSSection>
    <div class="flex">
        <div class="flex-none">
            <SectionHeading>Content</SectionHeading>
            <ul>
                {#each data.folders as folder}
                    <li class="border-blue-100 border-1 p-2 mb-2 rounded-sm">
                        <h3>{folder.name} ({folder.slug})</h3>
                        (<small>{folder.createdBy}</small>) - ({folder.id})<br />
                        <form method="POST" action="?/delFold" use:enhance>
                            <input type="hidden" name="id" value={folder.id} />
                            <button type="submit" class="text-orange-400">delete</button>
                        </form>

                        {#if folder.folders}
                            <ul class="list-disc">
                                {#each folder.folders as subFold}
                                    <li>{subFold.name}</li>
                                {/each}
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>

            <form method="POST" action="?/addFold" use:enhance>
                <label>
                    Name
                    <input name="name" type="name">
                </label>

                <button type="submit" class="button">Add</button>
            </form>
        </div>



    </div>
</CSSection>
</div>