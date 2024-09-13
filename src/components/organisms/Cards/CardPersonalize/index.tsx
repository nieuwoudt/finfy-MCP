"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useGetUser, useNavigationOnboarding, useUser } from "@/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CardPersonalize = () => {
  const user = useGetUser();
  const { updateUser, status, error } = useUser();
  const { nextStep } = useNavigationOnboarding();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: { name: string }) => {
    await updateUser({ name: values.name, email: user.email });
  };

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("The name was successfully saved!");
      nextStep();
    }
  }, [status]);

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
            disabled={status === "loading"}
          />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <Button disabled={status === "loading"} size="xl" full type="submit">
            Send
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardPersonalize };
