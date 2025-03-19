import { setError, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { folderSchema } from '$lib/forms/folder.validation';
import {folderNameAvailable, deleteFolder, newFolder}  from '$lib/services/cms/folders'
import { yup } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { idSchema } from '$lib/forms/id.validation';
import { getUserEmail } from '$lib/services/cms/helpers';



const evaluateName = async (form: SuperValidated<Infer<typeof folderSchema>>) => {
    const available = await folderNameAvailable(form.data.name)

	if (!available) {
		setError(form, 'name', 'Folder name is already taken.');
		return false;
	}
	return true;
}


export const actions = {
    addFold: async ({ request, locals }) => {
        const form = await superValidate(request, yup(folderSchema));

        const ok = await evaluateName(form)
        if (!form.valid || !ok) {
            return fail(400, { form });
        }

        await newFolder(await getUserEmail(locals), form.data.name, form.data.parentID)

        return { form };
    },
    delFold: async ({ request, locals }) => {
        const form = await superValidate(request, yup(idSchema));

        await deleteFolder(await getUserEmail(locals), form.data.id)
        return { form };
    },
    check: async ({ request }) => {
		const form = await superValidate(request, yup(folderSchema));

		if (await evaluateName(form)) {
            return fail(400, { form });
        }

        return { form };
	}
} satisfies Actions;