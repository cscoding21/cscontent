import { Ollama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


export const translateMessage = async (ask:string):Promise<string> => {
    const model = new Ollama({ model: "llama3" });
    const systemTemplate = "Translate the following into {language}:";
    const parser = new StringOutputParser();

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
    ]);

    const chain = promptTemplate.pipe(model).pipe(parser);

    return await chain.invoke({ language: "french", text: ask });
}

export const generateFromIntent = async (ask:string):Promise<string> => {
    const model = new Ollama({ model: "mistral" });
    const systemTemplate = "Translate the following into {language}:";
    const parser = new StringOutputParser();

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
    ]);

    const chain = promptTemplate.pipe(model).pipe(parser);

    return await chain.invoke({ language: "french", text: ask });
}
