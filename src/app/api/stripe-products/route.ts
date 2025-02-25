import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currency = searchParams.get("currency");

  if (!currency) {
    return NextResponse.json({ error: "Missing currency parameter" }, { status: 400 });
  }

  try {
    // Fetch all active products
    const products = await stripe.products.list({ active: true });

    // Fetch associated prices for each product, filtered by currency
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product?.id,
          currency, // Filter by currency
        });

        return {
          ...product, // Include all product details
          prices: prices.data, // Include associated prices filtered by currency
        };
      })
    );

    // Return the combined data
    return NextResponse.json(productsWithPrices, { status: 200 });
  } catch (error) {
    console.error("Error fetching products and prices:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}