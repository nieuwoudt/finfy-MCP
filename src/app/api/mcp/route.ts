import { NextResponse } from 'next/server';

/**
 * GET handler for the /.well-known/mcp.json endpoint
 * This provides Model Context Protocol configuration information to external clients
 */
export async function GET() {
  // Return the MCP configuration
  return NextResponse.json({
    name: "Finfy Financial Assistant",
    version: "1.0.0",
    description: "Access personal financial data and insights powered by Finfy",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://app.finfy.ai",
    maintainer: {
      name: "Finfy AI",
      email: "info@finfy.ai", 
      url: "https://finfy.ai"
    },
    tools: [
      {
        name: "get_context_block",
        description: "Retrieve enriched financial context for a user",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID to fetch context for"
            },
            max_tokens: {
              type: "number",
              description: "Maximum tokens to include in context (default: 1000000)"
            }
          },
          required: ["user_id"]
        }
      }
    ],
    auth: {
      type: "api_key",
      instructions: "Contact Finfy to request API access"
    }
  });
}

/**
 * Verify API key or token sent in the request
 */
async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  // No auth header provided
  if (!authHeader) {
    return false;
  }
  
  // Check if it's a Bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // TODO: Verify the token against your auth system
    // For now, we'll use a simple environment variable check
    return token === process.env.MCP_API_KEY;
  }
  
  // API key in header
  if (authHeader.startsWith('ApiKey ')) {
    const apiKey = authHeader.substring(7);
    // TODO: Verify the API key against your database
    return apiKey === process.env.MCP_API_KEY;
  }
  
  return false;
} 