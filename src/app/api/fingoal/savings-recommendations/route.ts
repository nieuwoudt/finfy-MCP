import { NextRequest, NextResponse } from "next/server";
import { getSavingsRecommendations, getAllSavingsRecommendations } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET handler for retrieving all savings recommendations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const startAt = searchParams.get("startAt") || undefined;
    const endAt = searchParams.get("endAt") || undefined;
    
    const response = await getAllSavingsRecommendations(startAt, endAt);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to get savings recommendations:", error);
    return NextResponse.json(
      { message: "Error getting savings recommendations" },
      { status: 500 }
    );
  }
}

// POST handler for submitting transactions to get savings recommendations
export async function POST(req: NextRequest) {
  try {
    const { transactions, type = "fingoal" } = await req.json();
    
    // Send transactions to FinGoal for savings recommendations
    const response = await getSavingsRecommendations(
      transactions,
      type as "fingoal" | "plaid" | "mx"
    );
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to get savings recommendations:", error);
    return NextResponse.json(
      { message: "Error getting savings recommendations" },
      { status: 500 }
    );
  }
} 