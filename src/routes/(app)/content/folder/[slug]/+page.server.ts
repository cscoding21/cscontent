import { folderSchema } from '$lib/forms/folder.validation';
import { getFolder } from '$lib/services/cms/folders.js';
import { superValidate } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';

export async function load({ params }) {
    let data = params;

    const folder = await getFolder(data.slug)
    const form = await superValidate(yup(folderSchema));

    return { folder, form };
  }