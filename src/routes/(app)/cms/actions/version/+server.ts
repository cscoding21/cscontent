import { newVersion, setPublishedVersion } from '$lib/services/cms/versions'
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const userID = "jeph"
    const { contentID } = await request.json();
    const resp = await newVersion(userID, contentID)

    return json({ resp }, { status: 201 });
}

export async function PUT({ request }) {
    const userID = "jeph"
    const { contentID, versionID } = await request.json();
    const resp = await setPublishedVersion(contentID, versionID)

    return json({ resp }, { status: 201 });
}