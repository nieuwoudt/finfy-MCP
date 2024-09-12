"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, PhoneInputField } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";
import { signInWithOtp } from "@/lib/supabase/actions";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import axios from "axios";

const CardVerifyPhoneNumber = () => {
  const user = useSelector((state: RootState) => state.user.user);
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
      const { data } = await axios("/api/get-session");
      console.log(data);
      const { errorMessage } = await signInWithOtp(
        values.phoneNumber,
        data
      );
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.set("phone", values.phoneNumber);
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
              Register
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
