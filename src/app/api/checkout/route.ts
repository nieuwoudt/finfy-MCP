import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { productId, email, customerId, isOnboarding } = await req.json();

    const isOnboardingReturn = !!isOnboarding;

    console.log("Fetching prices for product:", productId);

    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    if (!prices.data.length) {
      throw new Error(`No prices found for product: ${productId}`);
    }

    const priceId = prices.data[0].id;

    console.log("Using price:", priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId || undefined,
      customer_email: !customerId ? email : undefined,
      success_url: isOnboardingReturn ? `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/setup-complete?session_id={CHECKOUT_SESSION_ID}` : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      cancel_url: isOnboardingReturn ? `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/setup-complete` : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    console.log("Checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error },
      { status: 500 }
    );
  }
}
