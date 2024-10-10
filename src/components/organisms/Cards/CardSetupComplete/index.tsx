"use client";

import { Button, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useNavigationOnboarding, useUser } from "@/hooks";
import { setDataUser, updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

const CardSetupComplete = () => {
  const { prevStep } = useNavigationOnboarding();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const router = useRouter();

  const handleClickComplete = () => {
    startTransition(async () => {
      if (user?.id) {
        await dispatch(setDataUser(user?.id));
        if (user?.id) {
          await dispatch(
            updateUser({
              finished_onboarding: true,
            })
          );
        }
        router.push("/dashboard");
      } else {
        toast.error("Something Wrong!");
      }
    });
  };
  return (
    <CardTemplate
      title={
        <>
          <Icon type={"ShieldCompleteIcon"} />
          <h4 className="text-xl text-white font-semibold ">Success</h4>
        </>
      }
      classes={{
        cardHeader: "flex flex-col justify-center items-center",
        cardDescription: "text-center",
      }}
      description="Thank you! Your bank account was connected to Imali"
    >
      <CardTemplate.Footer className="flex justify-between flex-col w-full gap-3 items-center mt-6">
        <Button
          variant="ghost"
          as="link"
          href="/onboarding/connect-bank?redirect=/onboarding/setup-complete"
          size="xl"
          full
        >
          Connect another account
        </Button>
        <Button onClick={handleClickComplete} size="xl" full>
          {isPending ? <Loader2 className="animate-spin" /> : "Go to Dashboard"}
        </Button>
        <Button
          size="xl"
          onClick={prevStep}
          type="button"
          full
          variant="destructive"
          className="!rounded-md"
        >
          Back
        </Button>
      </CardTemplate.Footer>
    </CardTemplate>
  );
};

export { CardSetupComplete };
