import { translateMessage } from "$lib/services/cms/llm";
import { json } from "@sveltejs/kit";


export async function POST({ request }) {
	const { question } = await request.json();
	const answer = await translateMessage(question)

	return json({ answer: answer }, { status: 201 });
}
