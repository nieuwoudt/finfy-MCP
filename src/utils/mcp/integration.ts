import { FinifyMcpClient } from "./client";
import { FinifyMcpServer } from "./server";
import path from "path";

interface McpComponents {
  server: FinifyMcpServer;
  client: FinifyMcpClient;
}

// Singleton instances for the MCP components
let mcpServer: FinifyMcpServer | null = null;
let mcpClient: FinifyMcpClient | null = null;

/**
 * Initialize the MCP components (server and client)
 * This should be called during application startup
 */
export async function initializeMcp(anthropicApiKey: string): Promise<McpComponents> {
  // Initialize the server if not already running
  if (!mcpServer) {
    mcpServer = new FinifyMcpServer();
    await mcpServer.initialize();
    console.log("MCP Server initialized");
  }
  
  // Initialize the client if not already running
  if (!mcpClient) {
    // In a real deployment, you'd have a standalone server process
    // Here we're using the server-script.js to spawn a child process
    const serverScriptPath = path.resolve(__dirname, "./server-script.js");
    
    mcpClient = new FinifyMcpClient(
      "node",
      [serverScriptPath],
      anthropicApiKey
    );
    
    await mcpClient.initialize();
    console.log("MCP Client initialized");
  }
  
  return {
    server: mcpServer,
    client: mcpClient
  };
}

/**
 * Get the MCP client instance (initializing if needed)
 */
export async function getMcpClient(anthropicApiKey: string): Promise<FinifyMcpClient> {
  if (!mcpClient) {
    await initializeMcp(anthropicApiKey);
  }
  
  if (!mcpClient) {
    throw new Error("Failed to initialize MCP client");
  }
  
  return mcpClient;
}

/**
 * Generate a response to a user query using MCP
 * This can be integrated with the existing chat system
 */
export async function generateMcpResponse(
  userId: string, 
  userQuery: string, 
  anthropicApiKey: string
): Promise<string> {
  // Get or initialize the MCP client
  const client = await getMcpClient(anthropicApiKey);
  
  // Generate the response using the MCP client
  return client.generateLLMResponse(userId, userQuery);
}

/**
 * Clean up MCP resources
 * This should be called during application shutdown
 */
export async function cleanupMcp(): Promise<void> {
  if (mcpClient) {
    await mcpClient.close();
    mcpClient = null;
  }
  
  if (mcpServer) {
    await mcpServer.close();
    mcpServer = null;
  }
} 