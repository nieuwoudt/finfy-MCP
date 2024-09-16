"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding, useUser } from "@/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CardPersonalize = () => {
  const { updateUser, statusUpdate, error, user } = useUser();
  const { nextStep } = useNavigationOnboarding();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: { name: string }) => {
    if (user?.id) {
      await updateUser({ name: values.name, id: user?.id });
    }
  };

  useEffect(() => {
    if (statusUpdate === "succeeded" && user?.name) {
      toast.success("The name was successfully saved!");
      nextStep();
    }
  }, [statusUpdate, user?.name]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate
      title="Hello, I’m Imali"
      description="I’m next generation AI assistnt built for work and trained to be safe, accurate, and securre. I’d love for us to get to know each other a bit better. Helper text"
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
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <Button
            disabled={statusUpdate === "loading"}
            size="xl"
            full
            type="submit"
          >
            Send
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardPersonalize };
