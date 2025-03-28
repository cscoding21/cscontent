import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { URL } from "url"


export const findResources = async () => {
  const transport = new SSEClientTransport(new URL("http://example.com/sse"));
      
      const client = new Client(
        {
          name: "example-client",
          version: "1.0.0"
        },
        {
          capabilities: {
            prompts: {},
            resources: {},
            tools: {}
          }
        }
      );

      await client.connect(transport);


    //   // List prompts
    // const prompts = await client.listPrompts();

    // // Get a prompt
    // const prompt = await client.getPrompt("example-prompt", {
    // arg1: "value"
    // });

    // List resources
    const resources = await client.listResources();

    // // Read a resource
    // const resource = await client.readResource("file:///example.txt");

    // // Call a tool
    // const result = await client.callTool({
    // name: "example-tool",
    // arguments: {
    //     arg1: "value"
    // }
    // });

    return resources

}




