import { contentSchema } from '$lib/forms/content.validation';
import { idSchema } from '$lib/forms/id.validation.js';
import { contentNameAvailable, deleteContent, findContentInstances, getContent, newContent, updateContent } from '$lib/services/cms/content.js';
import { getUserEmail } from '$lib/services/cms/helpers.js';
import { fail, setError, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { getFolder } from '$lib/services/cms/folders';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
    let data = params;

    const slug = data.slug
    const fslug = data.fslug
    const folder = await getFolder(fslug)

    console.log("params", data)

    let content:any = null
    let instances:any = null

    if(slug) {
        content = await getContent(slug)
        instances = await findContentInstances(content.id)
    }

    const form = await superValidate(content, yup(contentSchema));

    return { content, instances, folder, form };
}


const evaluateName = async (form: SuperValidated<Infer<typeof contentSchema>>) => {
    const available = await contentNameAvailable(form.data.title)

    if (!available) {
        setError(form, 'title', 'Content title is already taken.');
        return false;
    }
    return true;
}


export const actions = {
    addCont: async ({ request, locals }) => {
        const form = await superValidate(request, yup(contentSchema));

        const ok = await evaluateName(form)
        if (!form.valid || !ok) {
            return fail(400, { form });
        }

        const nc = await newContent(await getUserEmail(locals), form.data.parentID, form.data.title, form.data.intent)
        const fold = await getFolder(nc.parentID)

        redirect(303, '/cms/folder/' + fold.slug + "/content/" + nc.slug)
    },
    updateCont: async ({ request, locals }) => {
        const form = await superValidate(request, yup(contentSchema));

        const nc = await updateContent(await getUserEmail(locals), form.data.id as string, form.data.title, form.data.intent, form.data.isActive, form.data.activeOn, form.data.expiresOn)
        const fold = await getFolder(nc.parentID)

        redirect(303, '/cms/folder/' + fold.slug + "/content/" + nc.slug)
    },
    delCont: async ({ request, locals }) => {
        const form = await superValidate(request, yup(idSchema));

        await deleteContent(await getUserEmail(locals), form.data.id)
        return { form };
    },
    check: async ({ request }) => {
        const form = await superValidate(request, yup(contentSchema));

        if (await evaluateName(form)) {
            return fail(400, { form });
        }

        return { form };
    }
} satisfies Actions;