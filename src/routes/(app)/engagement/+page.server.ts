import { contentSchema } from "$lib/forms/content.validation";
import { findResources } from "$lib/services/mcp/mcp";
import { superValidate } from "sveltekit-superforms";
import { yup } from "sveltekit-superforms/adapters";

export async function load({ params }) {
    const form = await superValidate(yup(contentSchema));

    //const tools = await findResources()

    return { form };
}
