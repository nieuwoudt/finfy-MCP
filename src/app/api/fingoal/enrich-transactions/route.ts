import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { submitRecentTransactionsForEnrichment, submitHistoricalTransactionsForEnrichment } from "@/utils/fingoal-api/service";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST handler to enrich user transactions
 * 
 * Request body parameters:
 * - userId: string (required) - The user ID to enrich transactions for
 * - enrichType: 'recent' | 'historical' (optional) - The type of enrichment to perform (default: 'recent')
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication (you may want to use your own auth middleware)
    const auth = await supabase.auth.getSession();
    if (!auth.data.session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { userId, enrichType = 'recent' } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Enrich transactions based on the enrichment type
    let result;
    if (enrichType === 'historical') {
      result = await submitHistoricalTransactionsForEnrichment(userId);
    } else {
      result = await submitRecentTransactionsForEnrichment(userId);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to enrich transactions', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `${enrichType === 'historical' ? 'Historical' : 'Recent'} transactions submitted for enrichment`
    });
  } catch (error) {
    console.error('Error enriching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check enrichment status
 * 
 * Query parameters:
 * - userId: string (required) - The user ID to check enrichment status for
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication (you may want to use your own auth middleware)
    const auth = await supabase.auth.getSession();
    if (!auth.data.session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // Fetch enrichment batches for the user
    const { data: batches, error } = await supabase
      .from('fingoal_batches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch enrichment batches', details: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        batches,
        recentBatch: batches.length > 0 ? batches[0] : null,
      }
    });
  } catch (error) {
    console.error('Error checking enrichment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 