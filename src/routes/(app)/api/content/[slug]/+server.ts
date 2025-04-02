import { json } from "@sveltejs/kit";
import { validateAPIKey } from "$lib/services/cms/apiauth";
import { getProcessedContent } from "$lib/services/cms/content";


/**
 * create a new api key for a user
 * @param param0 an object with the tag and content
 * @returns 
 */
export async function GET({ request, params }) {
    //const ok = await validateAPIKey(request)

    const { slug } = params
    const content = await getProcessedContent(slug)
    console.log("content", content)

    return json({ content }, { status: 201 });
}