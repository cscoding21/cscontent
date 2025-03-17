<script lang="ts">
	import { CSSection } from "$lib/components";

    interface Props {
        data: any
    }
    let { data }:Props = $props()
</script>

<div class="p-4">
<CSSection>
<h1>I'm home</h1>
<ul>
{#each data.summaries as s} 
    <li>{s.name} - {s.id}</li>
{/each}
</ul>
</CSSection>
</div>