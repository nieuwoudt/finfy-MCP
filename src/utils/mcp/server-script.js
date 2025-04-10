// This script initializes and runs the Finify MCP server
// It's used by the MCP client to spawn a server process

// We need to use require here since this is a direct Node.js script
// that will be executed via child_process
const { FinifyMcpServer } = require('./server');

async function main() {
  try {
    // Initialize the server
    const server = new FinifyMcpServer();
    await server.initialize();
    
    console.error('Finify MCP server started and waiting for requests...');
    
    // The server will keep running until the process is terminated
    // or the server.close() method is called
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('Shutting down Finify MCP server...');
      await server.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.error('Shutting down Finify MCP server...');
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting Finify MCP server:', error);
    process.exit(1);
  }
}

// Run the server
main().catch(error => {
  console.error('Unhandled error in Finify MCP server:', error);
  process.exit(1);
}); 