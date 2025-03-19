import { setError, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { folderSchema } from '$lib/forms/folder.validation';
import {folderNameAvailable, deleteFolder, findFolders, newFolder}  from '$lib/services/cms/folders'
import { yup } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { idSchema } from '$lib/forms/id.validation';
import { getUserEmail } from '$lib/services/cms/helpers';

export async function load() {
    const folders = await findFolders(null)
    const form = await superValidate(yup(folderSchema));

	return {
		folders,
        form
	};
}

