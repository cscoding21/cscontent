<script lang="ts">
	import { Input, Textarea } from "flowbite-svelte";
    import type { Snippet } from "svelte";

    interface Props {
        value: string
        multiLine?: boolean
    }
    let { value = $bindable(), multiLine }:Props = $props()

    let editMode = $state(false)
    //let original = value

    // const keydown = (event:any) => {
    //     if (event.key == 'Escape') {
    //         event.preventDefault()
    //         value = original
    //         editMode = false
    //     }
    // }

    // const focus = (element:any) => {
	// 	element.focus()
	// }

</script>

<div class="h-fit">
{#if editMode}
    {#if multiLine}
        <!-- <Textarea class="resize-none flex-1 p-4" bind:value={value}></Textarea> -->
    {:else}
        <!-- <Input class="border" bind:value={value} /> -->
    {/if}
{:else}
    <!-- <div onclick={() => editMode = true}>{value}</div> -->
{/if}
</div>