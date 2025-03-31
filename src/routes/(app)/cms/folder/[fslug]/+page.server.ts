import { folderSchema } from '$lib/forms/folder.validation';
import { getFolder } from '$lib/services/cms/folders.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ params }) {
    let data = params;

    const folder = await getFolder(data.fslug)
    const form = await superValidate(zod(folderSchema));

    return { folder, form };
  }