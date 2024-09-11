"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, PhoneInputField } from "@/components/molecules";
import { useForm, useFormContext } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";

const CardVerifyPhoneNumber = () => {
  const { nextStep } = useNavigationOnboarding();
  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handlePhoneNumberChange = (phone: string) => {
    setValue("phoneNumber", phone);
  };

  const onSubmit = async () => {
    nextStep();
  };
  const phoneNumberError = errors.phoneNumber?.message as string;

  return (
    <CardTemplate
      title="First, let’s create your account"
      description="Verify a mobile phone number"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <PhoneInputField onChange={handlePhoneNumberChange} value={"+27"} />
          <div className="mt-2 flex w-full items-center justify-center">
            {errors.phoneNumber && <p className="error">{phoneNumberError}</p>}
          </div>
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <div className="w-full">
            <Button size="xl" full type="submit">
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
