import { NextRequest, NextResponse } from "next/server";
import { getEnrichedTransactions } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";
import { enrichTransactionWithFinGoalData, toSupabaseTransactionFormat } from "@/utils/adapters/transactionAdapters";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const batchId = params.batchId;
    
    // Fetch enriched transactions from FinGoal
    const enrichedData = await getEnrichedTransactions(batchId);
    
    if (!enrichedData.enrichedTransactions || enrichedData.enrichedTransactions.length === 0) {
      return NextResponse.json(
        { message: "No enriched transactions found" },
        { status: 404 }
      );
    }
    
    // Update batch status in database
    await supabase
      .from("enrichment_batches")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("batch_id", batchId);
    
    // Get the original transactions from database
    const { data: originalTransactions } = await supabase
      .from("transactions")
      .select("*")
      .in(
        "transaction_id",
        enrichedData.enrichedTransactions.map((t: any) => t.transactionid)
      );
    
    if (!originalTransactions || originalTransactions.length === 0) {
      return NextResponse.json(enrichedData);
    }
    
    // Map original transactions to a dictionary for easy lookup
    const transactionMap = originalTransactions.reduce((acc: any, t: any) => {
      acc[t.transaction_id] = t;
      return acc;
    }, {});
    
    // Enrich original transactions with FinGoal data
    const updatedTransactions = enrichedData.enrichedTransactions.map((enriched: any) => {
      const original = transactionMap[enriched.transactionid];
      if (!original) return null;
      
      // Reconstruct the normalized transaction
      const normalizedTransaction = {
        provider: original.provider,
        transaction_id: original.transaction_id,
        user_id: original.user_id,
        account_id: original.account_id,
        amount: original.amount,
        date: original.date,
        description: original.name,
        merchant_name: original.merchant_name,
        category: Array.isArray(original.category) ? original.category[0] : original.category,
        category_id: original.category_id,
        category_hierarchy: Array.isArray(original.category) ? original.category : [original.category],
        payment_channel: original.payment_channel,
        pending: original.pending,
        currency_code: original.iso_currency_code,
        tags: original.tags || [],
        enriched: original.enriched,
        original_data: original.original_data ? JSON.parse(original.original_data) : {},
        enrichment_data: original.enrichment_data ? JSON.parse(original.enrichment_data) : null
      };
      
      // Enrich with FinGoal data
      const enrichedTransaction = enrichTransactionWithFinGoalData(
        normalizedTransaction,
        enriched
      );
      
      // Format for Supabase
      return toSupabaseTransactionFormat(enrichedTransaction);
    }).filter(Boolean);
    
    // Update transactions in database with enriched data
    for (const transaction of updatedTransactions) {
      await supabase
        .from("transactions")
        .update(transaction)
        .eq("transaction_id", transaction.transaction_id);
    }
    
    // Save transaction tags
    const transactionTags = enrichedData.enrichedTransactions.flatMap((enriched: any) => {
      if (!enriched.tags || !Array.isArray(enriched.tags) || enriched.tags.length === 0) {
        return [];
      }
      
      return enriched.tags.map((tag: string) => ({
        transaction_id: enriched.transactionid,
        tag: tag,
        source: 'fingoal',
        created_at: new Date().toISOString()
      }));
    });
    
    if (transactionTags.length > 0) {
      await supabase
        .from("transaction_tags")
        .upsert(transactionTags, { onConflict: 'transaction_id,tag' });
    }
    
    return NextResponse.json({
      enrichedTransactions: updatedTransactions,
      transactionCount: updatedTransactions.length,
      tagCount: transactionTags.length
    });
  } catch (error) {
    console.error("Failed to retrieve enriched transactions:", error);
    return NextResponse.json(
      { message: "Error retrieving enriched transactions" },
      { status: 500 }
    );
  }
} 