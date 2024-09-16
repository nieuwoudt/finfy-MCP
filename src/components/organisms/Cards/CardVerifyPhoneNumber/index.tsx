"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, PhoneInputField } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";
import { signInWithOtp } from "@/lib/supabase/actions";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CardVerifyPhoneNumber = () => {
  const [isPending, startTransition] = useTransition();
  const { nextStep } = useNavigationOnboarding();
  const searchParams = useSearchParams();
  const {
    setValue,
    getValues,
    trigger,
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

  const onSubmit = async (values: { phoneNumber: string }) => {
    startTransition(async () => {
      await axios.post("/api/update-user", {
        phone: values.phoneNumber,
      });
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
