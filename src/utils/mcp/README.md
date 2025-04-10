# Finfy MCP Implementation

This directory contains Finfy's Model Context Protocol (MCP) implementation, which enables Cache-Augmented Generation (CAG) for financial data insights.

## Architecture

The implementation consists of two main components:

1. **MCP Server**: Exposes Finfy's financial data through MCP tools
2. **MCP Client**: Connects to the MCP server and integrates with LLMs

## Directory Structure

```
/mcp
  ├── client.ts           # MCP client implementation
  ├── server.ts           # MCP server implementation
  ├── integration.ts      # Integration utilities for the chat system
  ├── test.ts             # Test utilities
  ├── server-script.js    # Server script for running the MCP server
  └── package.json        # Dependencies
```

## Features

### MCP Server

The MCP server exposes the following tools:

- `get_context_block`: Retrieves enriched financial context for a user, including:
  - User profile information
  - Account data
  - Transaction history
  - Financial insights (from Fingoal - to be implemented)

### MCP Client

The MCP client provides:

- Connection to the MCP server
- Context retrieval and injection into LLM prompts
- LLM API integration (currently Anthropic Claude)

## Usage

### Setting Up

1. Install the required dependencies:

```bash
cd src/utils/mcp
npm install
```

2. Set the required environment variables:

```
ANTHROPIC_API_KEY=your_api_key_here
MCP_API_KEY=your_mcp_api_key_here
```

### Basic Usage

```typescript
import { initializeMcp, generateMcpResponse, cleanupMcp } from '@/utils/mcp/integration';

// Initialize MCP (should be done at app startup)
await initializeMcp(process.env.ANTHROPIC_API_KEY || '');

// Generate a response
const response = await generateMcpResponse(
  'user-123',                   // User ID
  'How much did I spend last month?', // User query
  process.env.ANTHROPIC_API_KEY || ''
);

// Clean up (should be done at app shutdown)
await cleanupMcp();
```

### Integration with Chat System

To integrate with the existing chat system, modify the chat action/reducer to use the MCP client:

```typescript
// In your chat slice or action
import { generateMcpResponse } from '@/utils/mcp/integration';

export const sendChatQuery = createAsyncThunk(
  "chat/sendChatQuery",
  async ({ user_id, chat_id, user_query }, { rejectWithValue }) => {
    try {
      // Generate response using MCP
      const response = await generateMcpResponse(
        user_id,
        user_query,
        process.env.ANTHROPIC_API_KEY || ''
      );
      
      return {
        output: {
          text: response
        }
      };
    } catch (error) {
      console.error("Error in sendChatQuery:", error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
```

## External MCP Client Support

This implementation also supports external MCP clients (like Claude Desktop) via:

- MCP configuration exposed at `/.well-known/mcp.json`
- API endpoint at `/api/mcp`

## Testing

To test the MCP implementation:

```bash
# Run the test script
npx ts-node test.ts USER_ID_HERE
```

## Fingoal Integration (TODO)

Once Fingoal credentials are available:

1. Add Fingoal API integration to the server
2. Extend the context block to include user tags and transaction enrichment
3. Update the tests to verify Fingoal data

## License

© Finfy AI Inc 