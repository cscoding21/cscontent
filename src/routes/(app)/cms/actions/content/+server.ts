import { updateContent } from "$lib/services/cms/content.js";
import { getUserEmail } from "$lib/services/cms/helpers.js";
import { json } from "@sveltejs/kit";



export async function PUT({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { id, title, intent, isActive, activeOn, expiresOn } = await request.json();
    const resp = await updateContent(userID, id, title, intent, isActive, activeOn, expiresOn)

    return json({ resp }, { status: 201 });
}