import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createSupabaseClient } from "@/lib/supabase/server";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
console.log(WEBHOOK_SECRET, "WEBHOOK_SECRET");
export async function POST(req: Request) {
  const body = await req.text();

  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const supabase = createSupabaseClient();
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session)?.id,
          {
            expand: ["line_items"],
          }
        );
        const customerId = session.customer as string;
        const customerDetails = session.customer_details;
        console.log(customerId, "customerId");
        if (customerDetails?.email) {
          const { data, error } = await supabase
            .from("users")
            .select()
            .ilike("email", customerDetails.email)
            .single();
          if (error) throw new Error("User not found");

          if (!data.customer_id) {
            const { error } = await supabase
              .from("users")
              .update({
                customer_id: customerId,
              })
              .eq("id", data?.id)
              .single();
            if (error) throw new Error("Oops!");
          }

          const lineItems = session.line_items?.data || [];

          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === "recurring";

            if (isSubscription) {
              let endDate = new Date();
              if (priceId === process.env.STRIPE_YEARLY_PRICE_ID!) {
                endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
              } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID!) {
                endDate.setMonth(endDate.getMonth() + 1); // 1 month from now
              } else {
                throw new Error("Invalid priceId");
              }
              // it is gonna create the subscription if it does not exist already, but if it exists it will update it
              const { error } = await supabase
                .from("subscriptions")
                .insert([
                  {
                    plan: "premium",
                    period:
                      priceId === process.env.STRIPE_YEARLY_PRICE_ID!
                        ? "yearly"
                        : "monthly",
                    start_date: new Date(),
                    end_date: endDate,
                    user_id: data?.id,
                    created_at: new Date(),
                  },
                ])
                .select();
                console.log(error, 'error')
              if (error) throw new Error("Invalid");
              await supabase
                .from("users")
                .update({
                  subscribe_plan: "premium",
                })
                .eq("id", data?.id)
                .single();
            } else {
              // one_time_purchase
            }
          }
        }
        break;
      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription)?.id
        );
        // const user = await prisma.user.findUnique({
        // 	where: { customerId: subscription.customer as string },
        // });
        // if (user) {
        // await prisma.user.update({
        // 	where: { id: user.id },
        // 	data: { plan: "free" },
        // });
        // } else {
        // 	console.error("User not found for the subscription deleted event.");
        // 	throw new Error("User not found for the subscription deleted event.");
        // }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling event", error);
    return new Response("Webhook Error", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
