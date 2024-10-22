"use client";

import { Icon, Button } from "@/components/atoms";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { benefits } from "./index.constants";
import { useUser } from "@/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/config/env";

const SubscribePopCard = ({isOnboarding = false}: {isOnboarding?: boolean}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY!);


  const monthlyPlanId = config.STRAPI_MONTHLY_ID || "";
  const yearlyPlanId = config.STRAPI_YEARLY_ID || "";
  const [selectedOption, setSelectedOption] = useState<string>(yearlyPlanId);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      console.log(stripe)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          name: user?.name,
          customerId: user?.customer_id,
          productId: selectedOption,
          isOnboarding: isOnboarding,
        }),
      });
      console.log(response, "responseresponse")


      const { sessionId } = await response.json();

      console.log(sessionId, "responseresponse")

      if (!stripe) {
        throw new Error("Stripe not loaded");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        alert(error.message);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white mx-auto bg-navy-25 rounded-lg border-none pt-4 max-w-72">
      <div className="w-full flex flex-col justify-center items-center mt-5 gap-1.5">
        <Icon type="FullLogoIcon" className="w-32" />
        <p className="text-grey-15 text-xs text-center">
          Personalized AI that makes you more productive, creative, and extraordinary
        </p>
        <ul className="flex flex-col w-full gap-4 my-4">
          {benefits.map((item, index) => (
            <li className="flex gap-3" key={index}>
              <span className="min-w-4 bg-purple-15 h-4 rounded-full flex justify-center items-center">
                {item.icon}
              </span>
              <div className="w-full gap-1 flex flex-col">
                <h3 className="text-sm text-white font-medium">{item.title}</h3>
                <p className="text-xs text-grey-15 font-medium">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="gap-4 flex w-full">
        <RadioOption
          value={monthlyPlanId}
          label="Billed Monthly"
          price="$20 /mo"
          selected={selectedOption === monthlyPlanId}
          onSelect={() => handleOptionChange(monthlyPlanId)}
        />
        <RadioOption
          value={yearlyPlanId}
          label="Billed Yearly"
          price="$15 /mo"
          selected={selectedOption === yearlyPlanId}
          onSelect={() => handleOptionChange(yearlyPlanId)}
        />
      </div>

      <div className="flex w-full flex-col gap-2 items-center justify-between !mt-4">
        <Button
          size="xl"
          onClick={handleCheckout}
          full
          disabled={isLoading}
          className="!rounded-md"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Get Pro"}
        </Button>
      </div>
    </div>
  );
};

interface RadioOptionProps {
  value: string;
  label: string;
  price: string;
  selected: boolean;
  onSelect: () => void;
}

const RadioOption: FC<RadioOptionProps> = ({
  value,
  label,
  price,
  selected,
  onSelect,
}) => (
  <div
    className={cn(
      "border border-navy-5 rounded-md cursor-pointer p-4 flex flex-col gap-1 w-full",
      selected ? "border-purple-15 border-2" : ""
    )}
    onClick={onSelect}
  >
    <span className="text-[10px] text-grey-15 font-normal">{label}</span>
    <span className="text-white text-xs font-medium flex gap-0.5">{price}</span>
  </div>
);

export { SubscribePopCard };
