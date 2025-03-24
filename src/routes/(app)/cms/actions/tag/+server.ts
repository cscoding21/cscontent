import { getUserEmail } from '$lib/services/cms/helpers';
import { deleteTag, tagContent } from '$lib/services/cms/tags'
import { json } from '@sveltejs/kit';

/**
 * apply a tag to content...deleting it if it doesn't exist
 * @param param0 an object with the tag and content
 * @returns 
 */
export async function POST({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { contentID , tag } = await request.json();
    const resp = await tagContent(userID, contentID, tag)

    return json({ resp }, { status: 201 });
}


export async function DELETE({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { contentID , tag } = await request.json();
    const resp = await deleteTag(userID, contentID, tag)

    return json({ resp }, { status: 201 });
}

// export async function PUT({ request }) {
//     const userID = "jeph"
//     const { contentID, versionID } = await request.json();
//     const resp = await setPublishedVersion(contentID, versionID)

//     return json({ resp }, { status: 201 });
// }