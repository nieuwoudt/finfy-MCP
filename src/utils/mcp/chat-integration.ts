/**
 * Chat Integration Example for MCP
 * 
 * This file shows how to integrate the MCP client with the existing chat system.
 * It provides a modified version of the sendChatQuery thunk that uses MCP for context-enhanced responses.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/utils/helpers";
import { getMcpClient } from "./integration";

interface ChatQueryParams {
  user_id: string;
  chat_id: string;
  history: string[];
  user_query: string;
  provider?: string;
  category?: string;
}

interface ChatResponse {
  output: {
    text: string;
  };
  calculations: null | Record<string, any>;
  suggested_questions: string[];
}

interface ChatError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Enhanced version of sendChatQuery that uses MCP for context-augmented generation
 */
export const sendChatQueryWithMcp = createAsyncThunk<
  ChatResponse, // Return type
  ChatQueryParams, // Argument type
  {
    rejectValue: ChatError;
  }
>(
  "chat/sendChatQuery",
  async (
    { user_id, chat_id, history, user_query, provider, category }: ChatQueryParams,
    { rejectWithValue }
  ) => {
    try {
      // Check if we have an API key for Anthropic
      const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicApiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable is not set");
      }

      // Get or initialize the MCP client
      const client = await getMcpClient(anthropicApiKey);
      
      if (!client) {
        throw new Error("Failed to initialize MCP client");
      }
      
      // Generate response using MCP client with context-augmented generation
      const response = await client.generateLLMResponse(user_id, user_query);
      
      // Format the response to match the expected structure
      return {
        output: {
          text: response
        },
        calculations: null,
        suggested_questions: [
          "How much did I spend last month?",
          "What are my biggest expenses?",
          "How much do I spend on subscriptions?"
        ]
      };
    } catch (error) {
      console.error("Error in sendChatQuery:", error);
      Sentry.captureException(error);
      return rejectWithValue({
        message: getErrorMessage(error),
        details: error
      });
    }
  }
);

/**
 * To integrate with the existing chat system:
 * 
 * 1. First, install the MCP SDK:
 *    npm install @modelcontextprotocol/sdk
 * 
 * 2. Replace the existing sendChatQuery thunk in chatSlice.ts with the enhanced version above
 * 
 * 3. Make sure environment variables are set:
 *    - ANTHROPIC_API_KEY=your_api_key_here
 * 
 * 4. Initialize MCP during application startup:
 *    import { initializeMcp } from "@/utils/mcp/integration";
 *    
 *    // In your app initialization
 *    await initializeMcp(process.env.ANTHROPIC_API_KEY || '');
 * 
 * 5. Clean up MCP during application shutdown:
 *    import { cleanupMcp } from "@/utils/mcp/integration";
 *    
 *    // In your app cleanup
 *    await cleanupMcp();
 */ 