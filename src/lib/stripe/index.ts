import { Stripe } from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
	apiVersion: "2024-09-30.acacia",
	typescript: true,
});


export const createStripeCustomer = async (email: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
    });
    console.log("Customer created:", customer.id);
    return customer.id;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};
