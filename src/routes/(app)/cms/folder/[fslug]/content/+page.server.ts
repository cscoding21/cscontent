import { contentSchema } from "$lib/forms/content.validation";
import { contentNameAvailable, newContent } from "$lib/services/cms/content";
import { getFolder } from "$lib/services/cms/folders";
import { getUserEmail } from "$lib/services/cms/helpers";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, setError, superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";


export async function load({ params }) {
    let data = params;

    const fslug = data.fslug
    const folder = await getFolder(fslug)

    const form = await superValidate(yup(contentSchema));

    return { folder, form };

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
    check: async ({ request }) => {
        const form = await superValidate(request, yup(contentSchema));

        if (await evaluateName(form)) {
            return fail(400, { form });
        }

        return { form };
    }
} satisfies Actions;