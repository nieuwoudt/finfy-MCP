import { Icon } from "@/components/atoms";
import { plans } from "@/utils/constants";
import { CardSubscribePlan } from "@/components/organisms";
import { Plan } from "@/types";
import { useUser } from "@/hooks";
import { useEffect, useState } from "react";

const SubscriptionTab = () => {
  const { user } = useUser();
  const subscriptionId = user?.subscribe_plan; // ID підписки користувача

  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
      
    fetchStripeProducts();
  }, []);

  const plan = plans.find(({ id }) => id === currentPlanId);

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
              <CardSubscribePlan plan={plan as Plan} />
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
