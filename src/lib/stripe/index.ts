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

export enum StripeCustomerPortalFlowType {
  PAYMENT_UPDATE = "payment_method_update",
  SUBSCRIPTION_CANCEL = "subscription_cancel",
  SUBSCRIPTION_UPDATE = "subscription_update",
  SUBSCRIPTION_UPDATE_CONFIRM = "subscription_update_confirm",
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

export const redirectToStripeCustomerProtal = async (props: {
  customerId: string;
  subscriptionId: string;
  path: string;
  productToUpdate: {
    product: string;
    prices: string[];
  };
  stripeCustomerPortalFlowType?: StripeCustomerPortalFlowType;
}) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: props.customerId,
      return_url: `${props.path}`,
      // ...(props.stripeCustomerPortalFlowType &&
      //   props.stripeCustomerPortalFlowType ===
      //     StripeCustomerPortalFlowType.SUBSCRIPTION_UPDATE && {
      //     flow_data: {
      //       type: StripeCustomerPortalFlowType.SUBSCRIPTION_UPDATE,
      //       subscription_update: {
      //         subscription: props.subscriptionId,
      //       },
      //       after_completion: {
      //         type: "redirect",
      //         redirect: {
      //           return_url: `${props.path}`,
      //         },
      //       },
      //     },
      //   }),
      // ...(props.stripeCustomerPortalFlowType &&
      //   props.stripeCustomerPortalFlowType ===
      //     StripeCustomerPortalFlowType.PAYMENT_UPDATE && {
      //     flow_data: {
      //       type: StripeCustomerPortalFlowType.PAYMENT_UPDATE,
      //       after_completion: {
      //         type: "redirect",
      //         redirect: {
      //           return_url: `${props.path}`,
      //         },
      //       },
      //     },
      //   }),
    });
    // const configuration = await stripe.billingPortal.configurations.update(
    //   session.configuration as string,
    //   {
    //     features: {
    //       subscription_cancel: {
    //         cancellation_reason: {
    //           enabled: false,
    //         },
    //         mode: "immediately",
    //       },
    //       subscription_update: { products: [props.productToUpdate] },
    //     },
    //   }
    // );

    return session.url;
  } catch (error) {
    console.error("Failed to redirect to stripe customer portal", error);
    throw error;
  }
};
