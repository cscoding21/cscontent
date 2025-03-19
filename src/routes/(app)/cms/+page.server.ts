import { superValidate } from 'sveltekit-superforms';
import { folderSchema } from '$lib/forms/folder.validation';
import { findFolders}  from '$lib/services/cms/folders'
import { yup } from 'sveltekit-superforms/adapters';

export async function load() {
    const folders = await findFolders(null)
    const form = await superValidate(yup(folderSchema));

	return {
		folders,
        form
	};
}

