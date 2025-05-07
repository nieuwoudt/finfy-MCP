import { FinifyMcpClient } from "./client";
import { FinifyMcpServer } from "./server";

// Safe path reference
let pathModule: any = null;

// Only try to load path in server environment
if (typeof window === 'undefined') {
  try {
    // Dynamic import, but avoid Next.js error
    pathModule = require('path');
  } catch (error) {
    console.error("Error loading path module:", error);
  }
}

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
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
    console.log("Browser environment detected - using limited MCP implementation");
    
    // Create stub instances for browser environment
    if (!mcpServer) {
      mcpServer = {} as FinifyMcpServer;
      console.log("MCP Server stub created for browser");
    }
    
    if (!mcpClient) {
      mcpClient = new FinifyMcpClient(
        "browser-stub",
        [],
        anthropicApiKey
      );
      
      await mcpClient.initialize();
      console.log("MCP Client initialized for browser");
    }
  } else {
    // Server-side initialization
    try {
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
        let serverScriptPath = "./server-script.js";
        
        // Use path module if available
        if (pathModule) {
          serverScriptPath = pathModule.resolve(__dirname, "./server-script.js");
        }
        
        mcpClient = new FinifyMcpClient(
          "node",
          [serverScriptPath],
          anthropicApiKey
        );
        
        await mcpClient.initialize();
        console.log("MCP Client initialized");
      }
    } catch (error) {
      console.error("Error initializing MCP:", error);
      
      // Create stub instances as fallback
      if (!mcpServer) {
        mcpServer = {} as FinifyMcpServer;
      }
      
      if (!mcpClient) {
        mcpClient = new FinifyMcpClient(
          "fallback",
          [],
          anthropicApiKey
        );
        await mcpClient.initialize();
      }
    }
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