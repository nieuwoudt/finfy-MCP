import { Icon } from "@/components/atoms";
import { plans } from "@/utils/constants";
import { CardSubscribePlan } from "@/components/organisms";
import { Plan } from "@/types";
import { useState } from "react";

const SubscriptionTab = () => {
  const [currentPlan, setCurrentPlan] = useState(0);
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
          <p></p>

          {/* <CardSubscribePlan plan={plans.at(0) as Plan} /> */}
        </div>
      </div>
    </div>
  );
};
export { SubscriptionTab };
