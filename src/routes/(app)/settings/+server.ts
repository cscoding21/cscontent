import { deleteAPIKey, newAPIKey } from "$lib/services/cms/apiauth";
import { getUserEmail } from "$lib/services/cms/helpers";
import { json } from "@sveltejs/kit";


/**
 * create a new api key for a user
 * @param param0 an object with the tag and content
 * @returns 
 */
export async function POST({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { name } = await request.json();
    const resp = await newAPIKey(userID, name)

    return json({ resp }, { status: 201 });
}


export async function DELETE({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { id } = await request.json();
    const resp = await deleteAPIKey(userID, id)

    return json({ resp }, { status: 201 });
}