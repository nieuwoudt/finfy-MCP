import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import axios from "axios";

// Use type-only import for Node.js specific modules
type ChildProcess = any;

interface ToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * FinifyMcpClient - Finfy's Model Context Protocol Client implementation
 * 
 * This class is responsible for:
 * 1. Connecting to the MCP server
 * 2. Retrieving context blocks for users
 * 3. Sending queries with context to LLMs
 * 4. Processing LLM responses
 */
export class FinifyMcpClient {
  private client: Client;
  private transport: StdioClientTransport;
  private llmApiKey: string;
  private llmModel: string;
  private serverProcess: ChildProcess | null;

  constructor(
    serverCommand: string,
    serverArgs: string[],
    llmApiKey: string,
    llmModel: string = "claude-3-sonnet-20240229"
  ) {
    // Check if running in browser environment
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      console.warn('MCP client initialized in browser environment - some features may be limited');
      // Create a minimal implementation for browser compatibility
      this.transport = {} as StdioClientTransport;
      this.client = {} as Client;
    } else {
      this.transport = new StdioClientTransport({
        command: serverCommand,
        args: serverArgs
      });
      
      this.client = new Client({
        name: "finfy-client",
        version: "1.0.0"
      });
    }

    this.llmApiKey = llmApiKey;
    this.llmModel = llmModel;
    this.serverProcess = null;
  }

  /**
   * Initialize the MCP client and connect to the server
   */
  async initialize(): Promise<this> {
    // Skip connection in browser environment
    if (typeof window === 'undefined') {
      await this.client.connect(this.transport);
      console.log("Finfy MCP client initialized");
    } else {
      console.log("Finfy MCP client initialization skipped in browser");
    }
    return this;
  }

  /**
   * Retrieve context block for a user from the MCP server
   */
  async getContextBlock(userId: string, maxTokens: number = 1000000): Promise<string> {
    try {
      const result = await this.client.callTool({
        name: "get_context_block",
        arguments: {
          user_id: userId,
          max_tokens: maxTokens
        }
      }) as ToolResult;

      // Extract the context from the result
      if (result.content && result.content.length > 0 && result.content[0].type === "text") {
        return result.content[0].text;
      }
      
      throw new Error("No context block returned");
    } catch (error) {
      console.error("Error fetching context block:", error);
      throw error;
    }
  }

  /**
   * Generate an LLM response with user's financial context injected
   */
  async generateLLMResponse(userId: string, userQuery: string): Promise<string> {
    try {
      // 1. Get the context block from our MCP server
      const contextBlock = await this.getContextBlock(userId);
      
      // 2. Construct the full prompt with context injection
      const messages: LLMMessage[] = [
        {
          role: "system",
          content: `You are a helpful financial assistant for Finfy. 
          
You have access to the user's financial data which is provided below.
Use this information to provide accurate, personalized financial insights.
Only reference information that is explicitly included in the data below.
If you're unsure, acknowledge the limitations of the available data.

USER FINANCIAL DATA:
${contextBlock}`
        },
        {
          role: "user", 
          content: userQuery
        }
      ];
      
      // 3. Call the LLM API (Anthropic Claude in this example)
      const response = await axios.post<LLMResponse>(
        "https://api.anthropic.com/v1/messages",
        {
          model: this.llmModel,
          max_tokens: 2000,
          messages: messages
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.llmApiKey,
            "anthropic-version": "2023-06-01"
          }
        }
      );
      
      // 4. Return the LLM response
      if (response.data.content && response.data.content.length > 0) {
        return response.data.content[0].text;
      }
      
      throw new Error("No response from LLM");
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }

  /**
   * Close the MCP client connection
   */
  async close(): Promise<void> {
    if (typeof window === 'undefined') {
      await this.client.close();
      if (this.serverProcess) {
        this.serverProcess.kill();
        this.serverProcess = null;
      }
    }
  }
} 