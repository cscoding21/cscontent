<script lang="ts">
	import { SectionHeading } from '$lib/components';
	import { SignIn } from '@auth/sveltekit/components';
	import { GithubSolid, GoogleSolid } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';

	interface Props {
		data:any
		form?:any
	}
	let { form }:Props = $props()

	console.log(form)
</script>

<div class="mt-8">
	<div
		class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8"
	>

		<div class="w-full text-center">
			<SectionHeading>
				Sign in to <span class="text-md text-blue-500">cs</span>Content
			</SectionHeading>

			<div class="p-12">
			<SignIn  
				provider="github" 
				signInPage="signin" 
				className="w-full!"
				options={{ redirectTo: "/home" }}>
				<div slot="submitButton" class="w-full">
					<Button color="blue" size="md"><GithubSolid class="w-5 h-5 me-2" />Sign in with Github</Button>
				</div>
			</SignIn>
			<SignIn  
				provider="google" 
				signInPage="signin" 
				className="w-full mt-4"
				options={{ redirectTo: "/home" }}>
				<div slot="submitButton" class="w-full">
					<Button color="blue" size="md"><GoogleSolid class="w-5 h-5 me-2" />Sign in with Google</Button>
				</div>
			</SignIn>
		</div>
		</div>
	</div>
</div>