import { NextRequest, NextResponse } from "next/server";
import { getUserTags, triggerUserTagsUpdate } from "@/lib/fingoal";
import { createClient } from "@supabase/supabase-js";
import { FinGoalUserTag } from "@/types/fingoal";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const searchParams = req.nextUrl.searchParams;
    const sync = searchParams.get("sync") === "true";
    
    // Get user tags from FinGoal
    const userTagsData = sync
      ? await triggerUserTagsUpdate(userId)
      : await getUserTags(userId);
    
    if (!userTagsData.user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Save user tags to database
    if (userTagsData.user.tags && Array.isArray(userTagsData.user.tags)) {
      const userTags = userTagsData.user.tags.map((tag: FinGoalUserTag) => ({
        user_id: userId,
        tag_id: tag.id,
        name: tag.name,
        confidence: tag.confidence,
        tag_type: tag.tag_type,
        tag_description: tag.tag_description,
        source: 'fingoal',
        created_at: new Date().toISOString(),
      }));
      
      if (userTags.length > 0) {
        // Delete existing tags first
        await supabase
          .from("user_tags")
          .delete()
          .eq("user_id", userId)
          .eq("source", "fingoal");
        
        // Insert new tags
        await supabase
          .from("user_tags")
          .insert(userTags);
      }
    }
    
    return NextResponse.json(userTagsData);
  } catch (error) {
    console.error("Failed to get user tags:", error);
    return NextResponse.json(
      { message: "Error getting user tags" },
      { status: 500 }
    );
  }
} 