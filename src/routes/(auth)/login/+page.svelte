<script lang="ts">
	import { parseErrors, mergeErrors } from '$lib/forms/helpers';
	import { loginForm, loginSchema } from '$lib/forms/login.validation';
	import { goto } from '$app/navigation';
	import { EmailInput, PasswordInput, AlertError } from '$lib/components';
	import { enhance } from '$app/forms';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { GithubSolid, GoogleSolid } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';

	let errors: any = $state({});

	interface Props {
		data:any
		form?:any
	}
	let { data, form }:Props = $props()

	console.log(form)
</script>

<div class="mt-8">
	<div
		class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8"
	>

		<div class="w-full">
			<SignIn  
				provider="github" 
				signInPage="signin" 
				className="w-full!"
				options={{ redirectTo: "/home" }}>
				<div slot="submitButton" class="w-full">
					<Button size="md"><GithubSolid class="w-5 h-5 me-2" />Sign in with Github</Button>
				</div>
			</SignIn>
			<SignIn  
				provider="google" 
				signInPage="signin" 
				className="w-full mt-4"
				options={{ redirectTo: "/home" }}>
				<div slot="submitButton" class="w-full">
					<Button size="md"><GoogleSolid class="w-5 h-5 me-2" />Sign in with Google</Button>
				</div>
			</SignIn>
		</div>
	</div>
</div>