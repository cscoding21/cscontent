import { Ollama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


export const generate = async (ask:string):Promise<string> => {
    const model = new Ollama({ model: "mistral" });

    const messages = [
        new SystemMessage("Translate the following from English into Italian.  Only provide the translated result and not any additional context or notes."),
        new HumanMessage(ask),
    ];

    return model.invoke(messages);
}
