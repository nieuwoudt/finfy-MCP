import { NextRequest, NextResponse } from "next/server";
import { getSavingsRecommendations, getAllSavingsRecommendations } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * NOTICE: This feature is temporarily disabled based on recommendation from FinGoal.
 * They are working on a more powerful version of savings recommendations that will be released later this year.
 */

// GET handler for retrieving all savings recommendations
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      message: "Savings recommendations feature is temporarily disabled. FinGoal is working on a more powerful version that will be released later this year." 
    },
    { status: 503 }
  );
}

// POST handler for submitting transactions to get savings recommendations
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      message: "Savings recommendations feature is temporarily disabled. FinGoal is working on a more powerful version that will be released later this year." 
    },
    { status: 503 }
  );
} 