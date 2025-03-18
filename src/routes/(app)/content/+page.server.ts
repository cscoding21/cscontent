import {deleteFolder, findFolders, newFolder}  from '$lib/services/cms/folders'
import type { Actions } from './$types';

export async function load() {
    const folders = await findFolders()

	return {
		folders
	};
}

export const actions = {
    addFold: async ({ request, locals }) => {
        const session = await locals.auth()

        const data = await request.formData();
		const name = data.get('name');
        let parentID = data.get("parentID")

        console.log("name", name)
        //parentID = "42518f74-4e42-4d8f-9bec-cdd2344b2fd5"

        await newFolder(session?.user?.email as string, name as string, parentID as string|null)

        return { success: true };
    },
    delFold: async ({ request, locals }) => {
        const session = await locals.auth()

        const data = await request.formData();
		const id = data.get('id');

        await deleteFolder(session?.user?.email as string, id as string)
        return { success: true };
    },
} satisfies Actions;
