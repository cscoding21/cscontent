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
{#each data.users as s} 
    <li>{s.provider} {s.userId} - {s.provider}</li>
{/each}
</ul>
</CSSection>
</div>