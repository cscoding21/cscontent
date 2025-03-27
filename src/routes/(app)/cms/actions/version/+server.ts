import { getUserEmail } from '$lib/services/cms/helpers';
import { newVersion, setPublishedVersion } from '$lib/services/cms/versions.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { contentID, env } = await request.json();
    const resp = await newVersion(userID, contentID, env)

    return json({ resp }, { status: 201 });
}

export async function PUT({ request, locals }) {
    const userID = await getUserEmail(locals)
    const { versionID, contentID } = await request.json();
    const resp = await setPublishedVersion(userID, contentID, versionID)

    return json({ resp }, { status: 201 });
}