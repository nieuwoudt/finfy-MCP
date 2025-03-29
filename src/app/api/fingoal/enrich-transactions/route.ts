import { NextRequest, NextResponse } from "next/server";
import { enrichTransactions } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";
import { toFinGoalTransactionInput } from "@/utils/adapters/transactionAdapters";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { transactions, sync = false } = await req.json();
    
    // Convert to FinGoal format
    const fingoalTransactions = transactions.map(toFinGoalTransactionInput);
    
    // Send to FinGoal for enrichment
    const response = await enrichTransactions(fingoalTransactions, sync);
    
    // Store batch ID in database for later retrieval
    if (!sync && response.status?.batch_request_id) {
      const { error } = await supabase
        .from("enrichment_batches")
        .insert({
          batch_id: response.status.batch_request_id,
          status: "processing",
          created_at: new Date().toISOString(),
          transaction_count: fingoalTransactions.length,
        });
      
      if (error) {
        console.error("Failed to store batch ID:", error);
      }
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to enrich transactions:", error);
    return NextResponse.json(
      { message: "Error enriching transactions" },
      { status: 500 }
    );
  }
} 