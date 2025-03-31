import { contentSchema } from "$lib/forms/content.validation";
import { findResources } from "$lib/services/mcp/mcp";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ params }) {
    const form = await superValidate(zod(contentSchema));

    //const tools = await findResources()

    return { form };
}
