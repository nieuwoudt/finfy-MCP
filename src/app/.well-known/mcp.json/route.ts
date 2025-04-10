import { NextResponse } from 'next/server';

/**
 * This route exposes MCP configuration at the /.well-known/mcp.json path
 * It simply redirects to our main MCP API endpoint
 */
export async function GET() {
  // Redirect to our main MCP API endpoint
  return NextResponse.redirect(new URL('/api/mcp', process.env.NEXT_PUBLIC_SITE_URL || 'https://app.finfy.ai'));
} 