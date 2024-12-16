import { Icon } from "@/components/atoms";
import { plans } from "@/utils/constants";
import { CardSubscribePlan } from "@/components/organisms";
import { Plan } from "@/types";
import { useUser } from "@/hooks";
import { useEffect, useMemo, useState } from "react";

export enum BillingCycle {
  MONTHLY = 'monthly',
  ANNUALLY = 'annually'
}

function transformStripeProduct(stripeProduct: any): Plan[] {
  const { id, name, prices } = stripeProduct;

  const transformedPrices = prices.map((price: any) => {
    const { unit_amount, currency, recurring, metadata } = price;
    const billingCycle = recurring?.interval === "month" ? BillingCycle.MONTHLY : BillingCycle.ANNUALLY;

    return {
      id,
      name,
      pricing: {
        amount: unit_amount / 100,
        currency: currency.toUpperCase(),
        billingCycle,
        formattedPrice: `$${(unit_amount / 100).toLocaleString()} / ${
          billingCycle === "monthly" ? "month" : "year"
        }`,
      },
      description: {
        short: metadata.description,
        detailed: `Features include: ${Object.keys(metadata)
          .filter((key) => key.startsWith("feature"))
          .map((key) => metadata[key])
          .join(", ")}.`,
      },
      features: {
        highlighted: Object.keys(metadata)
          .filter((key) => key.startsWith("feature"))
          .map((key) => metadata[key]),
      },
      ctaButton: {
        label: `Choose ${billingCycle} plan`,
        isDisabled: false,
        type: "primary",
        link: null,
      },
    };
  });

  return transformedPrices;
}

const SubscriptionTab = () => {
  const { user } = useUser();
  const subscriptionId = user?.subscribe_plan; // ID підписки користувача

  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [stripePlans, setStripePlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const response = await fetch(
          `/api/stripe-subscription?subscriptionId=${subscriptionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const subscription = await response.json();
        const planId = subscription.items.data[0]?.price.product;
        setCurrentPlanId(planId);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) {
      fetchCurrentPlan();
    }
  }, [subscriptionId]);

  useEffect(() => {
    const fetchStripeProducts = async () => {
      try {
        const response = await fetch(
          `/api/stripe-products?currency=usd`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stripe products");
        }

        const products = await response.json();

        if (products.length > 0) {
          const formattedProducts = transformStripeProduct(products[0]);
          setStripePlans(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
      
    fetchStripeProducts();
  }, []);

  const plan  = useMemo(() => {
      return stripePlans.find((stripePlan) => stripePlan.pricing.billingCycle === billingCycle)
  },[billingCycle, stripePlans])


  console.log(plan, currentPlanId, plans);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="my-9">
      <div className="p-4 border rounded-md bg-navy-15 border-navy-5">
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="flex gap-2 text-2xl font-semibold text-white items-center">
            <Icon
              type="DollarIcon"
              className="w-6 h-6 stroke-transparent fill-white"
            />
            Subscriptions
          </h3>
          <div className="mx-auto">
            {plan ? (
              <CardSubscribePlan plan={plan as Plan} billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
            ) : (
              <div className="text-white">No plan found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SubscriptionTab };
