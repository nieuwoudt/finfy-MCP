"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";

const CardPersonalize = () => {
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
      title="Hello, I’m Imali"
      description="I’m next generation AI assistnt built for work and trained to be safe, accurate, and securre. I’d love for us to get to know each other a bit better. Helper text"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <Field full />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <Button size="xl" full type="submit">
            Send
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardPersonalize };
