import { createSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createSupabaseClient();

  try {
    const body = await req.json();
    const event = body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      console.log(`Payment completed for customer: ${customerId}`);

      const { error } = await supabase
        .from("users")
        .update({ subscribe_plan: subscriptionId })
        .eq("customer_id", customerId)
        .single();

      if (error) {
        console.error("Failed to update plan in Supabase:", error);
        return NextResponse.json(
          { error: "Failed to update plan" },
          { status: 500 }
        );
      }

      console.log(`Plan updated successfully for customer: ${customerId}`);
      return NextResponse.json({ message: "Plan updated successfully" });
    } else {
      console.log(`Unhandled event type ${event.type}`);
      return NextResponse.json(
        { message: `Unhandled event type ${event.type}` },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
