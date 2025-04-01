<script lang="ts">
	import { CSSection } from "$lib/components";
	import Breadcrumbs from "../cms/components/Breadcrumbs.svelte";

    interface Props {
        data:any
    }
    let { data }:Props = $props()

    let question = $state()
    let answer = $state()

    let resources = $state([])

    const getResponse = async () => {
        console.log(JSON.stringify(question))
        const response = await fetch('/engagement', {
            method: 'POST',
            body: JSON.stringify({ question: question }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let resp = await response.json()
        answer = resp.answer
    }

</script>

<Breadcrumbs topLevelLink="/engagement" topLevelName="Engagement" />

<div class="grid grid-cols-3 gap-4 p-4">
    <div class="col-span-2">
    <CSSection>     
        <div class="mb-5">
            <label for="intent" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
            <textarea name="intent" bind:value={question}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Intent"></textarea>
        </div>
    
        <div>
            <button onclick={getResponse} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ask</button>
        </div>
    </CSSection>

    {#if answer}
    <CSSection cssClass="mt-4">
        <div>{answer}</div>
    </CSSection>
    {/if}
    </div>
    <div class="col-span-1">
        <CSSection>
        <h3 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">AI Tools</h3>
        {#if data.tools}
        <ul>
            {#each data.tools as tool}
            <li>{tool}</li>
            {/each}
        </ul>
        {/if}
        </CSSection>
    </div>
</div>