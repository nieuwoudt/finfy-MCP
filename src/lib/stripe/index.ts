import { Stripe } from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY! || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!,
  {
    apiVersion: "2024-09-30.acacia",
    typescript: true,
  }
);

export enum StripeCheckoutMode {
  SUBSCRIPTION = "subscription",
  PAYMENT = "payment",
}

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

export const redirectToStripeCheckout = async (props: {
  mode: StripeCheckoutMode;
  priceId: string | string[];
  path: string;
  supabaseUserId: string;
  email: string;
  customer: string;
  cancelUrl: string;
  currency?: string;
}) => {
  try {
    const customer = props.customer;
    const customer_email = props.email;
    const isCustomerExist = !!customer;
    const lineItems = Array.isArray(props.priceId)
      ? props.priceId.map((item) => {
          return {
            price: item,
            quantity: 1,
          };
        })
      : [
          {
            price: props.priceId,
            quantity: 1,
          },
        ];
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: props.mode,
      success_url: props.path,
      cancel_url: props.cancelUrl,
      client_reference_id: props.supabaseUserId,
      allow_promotion_codes: true,
      ...(customer && { customer }),
      ...(!isCustomerExist && { customer_email }),
      ...(props.currency && { currency: props.currency.toUpperCase() }),
    });

    return session.url;
  } catch (error) {
    console.error("Failed to redirect to stripe checkout", error);
    throw error;
  }
};
