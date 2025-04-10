import { FinifyMcpServer } from "./server";
import { FinifyMcpClient } from "./client";
import path from "path";

/**
 * Test the MCP server functionality directly
 */
export async function testMcpServer(userId: string) {
  console.log("Starting MCP server test...");
  
  try {
    // Initialize the server
    const server = new FinifyMcpServer();
    await server.initialize();
    console.log("MCP Server initialized successfully");
    
    // Test the get_context_block tool directly
    console.log(`Testing get_context_block for user ${userId}...`);
    const result = await server.callToolDirectly("get_context_block", {
      user_id: userId
    });
    
    if (result.content && result.content.length > 0 && result.content[0].type === "text") {
      const contextBlock = result.content[0].text;
      console.log("Context block successfully generated:");
      console.log(contextBlock.substring(0, 500) + "..."); // First 500 chars
      console.log(`Total context length: ${contextBlock.length} characters`);
    } else {
      console.error("Failed to get context block");
    }
    
    // Close the server
    await server.close();
    console.log("MCP Server test completed");
    
    return true;
  } catch (error) {
    console.error("Error testing MCP server:", error);
    return false;
  }
}

/**
 * Test the end-to-end MCP flow (server + client)
 */
export async function testMcpEndToEnd(userId: string, query: string, apiKey: string) {
  console.log("Starting MCP end-to-end test...");
  
  try {
    // Start the server
    const server = new FinifyMcpServer();
    await server.initialize();
    console.log("MCP Server initialized successfully");
    
    // Initialize the client (pointing to a server script)
    // Note: In a real implementation, you would use an actual server script
    const serverScriptPath = path.resolve(__dirname, "./server-script.js");
    const client = new FinifyMcpClient(
      "node", 
      [serverScriptPath],
      apiKey
    );
    await client.initialize();
    console.log("MCP Client initialized successfully");
    
    // Test getting a context block
    console.log(`Testing context block generation for user ${userId}...`);
    const contextBlock = await client.getContextBlock(userId);
    console.log("Context block sample:");
    console.log(contextBlock.substring(0, 500) + "..."); // First 500 chars
    
    // Test generating an LLM response
    console.log(`Testing LLM response generation for query: "${query}"`);
    const llmResponse = await client.generateLLMResponse(userId, query);
    console.log("LLM response:");
    console.log(llmResponse);
    
    // Clean up
    await client.close();
    await server.close();
    console.log("MCP End-to-end test completed");
    
    return true;
  } catch (error) {
    console.error("Error testing MCP end-to-end:", error);
    return false;
  }
}

// Export a simple CLI runner if this file is executed directly
if (require.main === module) {
  const userId = process.argv[2];
  const query = process.argv[3] || "What are my spending habits?";
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  
  if (!userId) {
    console.error("Usage: node test.js <userId> [query]");
    process.exit(1);
  }
  
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
  }
  
  // Run the server test first
  testMcpServer(userId)
    .then(serverSuccess => {
      if (serverSuccess) {
        // If server test succeeds, run the end-to-end test
        return testMcpEndToEnd(userId, query, apiKey);
      }
      return false;
    })
    .then(success => {
      if (success) {
        console.log("All MCP tests passed successfully");
      } else {
        console.error("MCP tests failed");
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("Error running MCP tests:", error);
      process.exit(1);
    });
} 