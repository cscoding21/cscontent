import { superValidate } from 'sveltekit-superforms';
import { folderSchema } from '$lib/forms/folder.validation';
import { findFolders}  from '$lib/services/cms/folders'
import { zod } from 'sveltekit-superforms/adapters';

export async function load() {
    const folders = await findFolders(null)
    const form = await superValidate(zod(folderSchema));

	return {
		folders,
        form
	};
}

