"use client";

import { Dialog, Button } from "@/components/atoms";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import { SubscribePopCard } from "../SubscribePopCard";
import toast from "react-hot-toast";
import { useUser } from "@/hooks";
import { createStripeCustomer } from "@/lib/stripe";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";

interface SubscribePopProps extends PropsWithChildren { }

const SubscribePop: FC<SubscribePopProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const dispatch = useAppDispatch();

  const handleOpenChange = (value: boolean) => {
    if (!loading) {
      setOpen(value);
    }
  };

  useEffect(() => {
    const registerStripeCustomer = async () => {

      try {
        if (user?.id && user?.email && !user?.customer_id && open) {
          setLoading(true)
          toast.success("Creating new customer...");
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="text-sm w-full">{children}</Dialog.Trigger>
      <Dialog.Content className="text-white bg-navy-25 rounded-lg border-none pt-4 max-w-72">
        {loading ? <></> : <SubscribePopCard />}
        <Dialog.Close asChild>
          <Button
            gap-4
            size="xl"
            full
            variant="destructive"
            className="!rounded-md"
            disabled={loading}
          >
            Not now
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
};

export { SubscribePop };
