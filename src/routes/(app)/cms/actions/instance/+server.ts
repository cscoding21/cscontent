import { getUserEmail } from '$lib/services/cms/helpers';
import { deleteInstance, newInstance, updateInstance } from '$lib/services/cms/instances.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { contentID, versionID, lang,  body } = await request.json();
    const resp = await newInstance(userID, contentID, lang, versionID, body)

    return json({ resp }, { status: 201 });
}

export async function PUT({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { instanceID, body, meta, selectors } = await request.json();
    const resp = await updateInstance(userID, instanceID, body, meta, selectors)

    return json({ resp }, { status: 201 });
}

export async function DELETE({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { instanceID } = await request.json();
    const resp = await deleteInstance   (userID, instanceID)

    return json({ resp }, { status: 201 });
}