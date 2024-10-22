'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { CardTemplate, CurrencySelector } from "@/components/molecules";
import { SubscribePopCard } from "@/components/molecules/SubscribePopCard";
import { useNavigationOnboarding } from "@/hooks";
import { RootState } from "@/lib/store";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { OptionsType } from "@/types";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createStripeCustomer } from "@/lib/stripe";

const AddStripe = () => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<any>(false);

  useEffect(() => {
    const registerStripeCustomer = async () => {
      try {
        if (user?.id && user?.email && !user?.customer_id) {
          toast.success("Waite! Creating new customer...");
          setLoading(true)
          const customerId = await createStripeCustomer(user.email);
          console.log("Customer ID:", customerId);

          await dispatch(
            updateUser({
              customer_id: customerId,
            })
          );
          setLoading(false)
          toast.success("Customer successfully registered in Stripe!");
        }
      } catch (error) {
        setLoading(false)
        console.error("Error registering customer in Stripe:", error);
        toast.error("Error registering customer in Stripe.");
      }
    };

    if (user?.id) {
      registerStripeCustomer();
    }
  }, [user?.id, user?.email, user?.customer_id, dispatch]);

  const onSkip = async () => {
    nextStep();
  };

  return (
    <CardTemplate title="Add your plan">
      <CardTemplate.Content>
        <SubscribePopCard isOnboarding />
      </CardTemplate.Content>
      <CardTemplate.Footer className="flex justify-between items-center mt-10">
        <Button
          size="xl"
          onClick={prevStep}
          disabled={loading}
          type="button"
          variant="destructive"
          className="!rounded-md"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Back"
          )}
        </Button>
        <Button
          onClick={onSkip}
          size="xl"
          type={"submit"}
          disabled={loading}
          className="!rounded-md"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export { AddStripe };
