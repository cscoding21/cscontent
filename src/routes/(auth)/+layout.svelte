<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	//import { authService } from '$lib/services/auth';

	//const as = authService();
    let { children } = $props();

	onMount(async () => {
		// console.log('auth layout.svelte authenticated', as.authCheck());
		// if (await as.authCheck()) {
		// 	goto('/home');
		// }
	});
</script>

<div class="flex flex-row">
	<div class="basis-1/3">&nbsp;</div>
	<div class="basis-1/3">{@render children()}</div>
	<div class="basis-1/3">&nbsp;</div>
</div>