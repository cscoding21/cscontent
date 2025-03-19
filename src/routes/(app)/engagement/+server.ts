import { generate } from "$lib/services/cms/llm";
import { json } from "@sveltejs/kit";


export async function POST({ request }) {
	const { question } = await request.json();

    console.log("question", question)

	const answer = await generate(question)

    console.log("answer", answer)

	return json({ answer: answer }, { status: 201 });
}
