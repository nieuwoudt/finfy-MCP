"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, PhoneInputField } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";
import { signInWithOtp } from "@/lib/supabase/actions";
import toast from "react-hot-toast";
import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const CardVerifyPhoneNumber = () => {
  const [isPending, startTransition] = useTransition();
  const { nextStep } = useNavigationOnboarding();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      phoneNumber: "+27",
    },
  });
  const handlePhoneNumberChange = (phone: string) => {
    setValue("phoneNumber", phone);
  };
  const router = useRouter();

  useEffect(() => {
    async function handleSignInWithOtp() {
      if (user?.finished_onboarding) {
        router.push("/dashboard");
        return null
      }
      if (user?.phone) {
        try {
          const { errorMessage } = await signInWithOtp(user?.phone.replace("+", ""));
          console.log(errorMessage);
          const RESEND_TIME = 60;
          localStorage.setItem(
            "resendTimer",
            (Date.now() + RESEND_TIME * 1000).toString()
          );
          const params = new URLSearchParams(searchParams.toString());
          nextStep(`?${params.toString()}`);
        } catch (error) {
          console.error("Error during OTP sign-in:", error);
        }
      }
    }
  
    handleSignInWithOtp();
  }, [nextStep, searchParams, user]);
  

  const onSubmit = async (values: { phoneNumber: string }) => {
    startTransition(async () => {
      if (user?.phone) {
        const params = new URLSearchParams(searchParams.toString());
        nextStep(`?${params.toString()}`);
      } else {
        const { errorMessage } = await signInWithOtp(values.phoneNumber);
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          const params = new URLSearchParams(searchParams.toString());
          params.set("phone", values.phoneNumber);
          const RESEND_TIME = 60;
          localStorage.setItem(
            "resendTimer",
            (Date.now() + RESEND_TIME * 1000).toString()
          );
          nextStep(`?${params.toString()}`);
          toast.success("The confirmation code has been sent!");
        }
      }

    });
  };
  const phoneNumberError = errors.phoneNumber?.message as string;

  return (
    <CardTemplate
      title="First, let’s create your account"
      description="Verify a mobile phone number"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <PhoneInputField
            disabled={isPending}
            onChange={handlePhoneNumberChange}
            value={getValues("phoneNumber")}
          />
          <div className="mt-2 flex w-full items-center justify-center">
            {errors.phoneNumber && <p className="error">{phoneNumberError}</p>}
          </div>
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <div className="w-full">
            <Button disabled={isPending} size="xl" full type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>
            <p className="text-sm text-grey-15 mt-4">
              We verify a phone number on account creation to ensure account
              security. SMS & data charges may apply.
            </p>
          </div>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardVerifyPhoneNumber };
