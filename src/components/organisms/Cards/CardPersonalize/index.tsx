"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding, useUser } from "@/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CardPersonalize = () => {
  const { updateUser, statusUpdate, error, user } = useUser();
  const { nextStep, prevStep } = useNavigationOnboarding();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: user?.name,
    },
  });

  const onSubmit = async (values: { name?: string }) => {
    if (user?.id) {
      await updateUser({ name: values.name });
      toast.success("The name was successfully saved!");
      nextStep();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate
      title="Hello, I’m Finfy"
      description="I’m your AI-powered financial assistant, here to help you manage your money smarter. With me, you can track your spending, set savings goals, and plan your financial future — all securely and accurately. Let’s get started!"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <Field
            full
            placeholder="Enter your full name"
            {...register("name")}
            disabled={statusUpdate === "loading"}
          />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 flex-col mt-4">
          <Button
            disabled={statusUpdate === "loading"}
            size="xl"
            full
            type="submit"
          >
            Send
          </Button>
          <Button
            size="xl"
            type="button"
            onClick={prevStep}
            variant="destructive"
            full
          >
            Back
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardPersonalize };
