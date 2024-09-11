"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";

const CardConfirmPhoneNumber = () => {
  const { nextStep } = useNavigationOnboarding();
  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async () => {
    nextStep();
  };

  return (
    <CardTemplate
      title="First, let's create your account"
      description="Please enter the code sent via text"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <Field full />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <div className="w-full">
            <Button size="xl" full type="submit">
              Verify & Create Account
            </Button>
            <p className="text-sm text-grey-15 mt-4">
              Not seeing the code? Try again
            </p>
          </div>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardConfirmPhoneNumber };
