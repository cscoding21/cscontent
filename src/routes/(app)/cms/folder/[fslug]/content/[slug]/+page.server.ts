import { contentSchema } from '$lib/forms/content.validation';
import { idSchema } from '$lib/forms/id.validation.js';
import { contentNameAvailable, deleteContent, getContent, updateContent } from '$lib/services/cms/content';
import { findContentInstances } from '$lib/services/cms/instances';
import { findContentVersions } from '$lib/services/cms/versions'
import { getUserEmail } from '$lib/services/cms/helpers.js';
import { fail, setError, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { getFolder } from '$lib/services/cms/folders';
import { redirect } from '@sveltejs/kit';
import type { Version } from '@prisma/client';
import { findContentTags } from '$lib/services/cms/tags';

export async function load({ params, url }) {
    let data = params;

    const slug = data.slug
    const fslug = data.fslug
    const folder = await getFolder(fslug)
    let v = url.searchParams.get('v');

    let content = await getContent(slug)
    let versions = await findContentVersions(content.id)
    let specifiedVersion = getPublishedVersionID(versions, v)
    let instances = await findContentInstances(content.id, specifiedVersion.id)
    let tags = await findContentTags(content.id)

    const pathname = url.pathname
    const form = await superValidate(content, zod(contentSchema));

    return { content, instances, versions, folder, form, tags, pathname, specifiedVersion };
}

const getPublishedVersionID = (versions:Version[], specifiedVersion:string|null):Version => {
    if(specifiedVersion) {
        let sv = versions.filter(v => v.id === specifiedVersion)

        return sv[0]
    }

    let ver = versions.filter(v => v.isPublished)

    if(ver.length > 0) {
        return ver[0]
    }

    return versions[0]
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
    updateCont: async ({ request, locals }) => {
        const form = await superValidate(request, zod(contentSchema));

        const nc = await updateContent(await getUserEmail(locals), form.data.id as string, form.data.title, form.data.intent, form.data.isActive, form.data.activeOn, form.data.expiresOn)
        const fold = await getFolder(nc.parentID)

        redirect(303, '/cms/folder/' + fold.slug + "/content/" + nc.slug)
    },
    delCont: async ({ request, locals }) => {
        const form = await superValidate(request, zod(idSchema));

        await deleteContent(await getUserEmail(locals), form.data.id)
        return { form };
    },
    check: async ({ request }) => {
        const form = await superValidate(request, zod(contentSchema));

        if (await evaluateName(form)) {
            return fail(400, { form });
        }

        return { form };
    }
} satisfies Actions;