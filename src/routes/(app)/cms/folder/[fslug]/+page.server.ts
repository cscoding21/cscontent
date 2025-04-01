import { folderSchema } from '$lib/forms/folder.validation';
import { findFolderLineage, getFolder } from '$lib/services/cms/folders';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ params }) {
    let data = params;

    const folder = await getFolder(data.fslug)
    const folderTree = await findFolderLineage(folder.id)
    const form = await superValidate(zod(folderSchema));

    return { folder, form, folderTree };
  }