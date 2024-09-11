"use client";

import { Button, Field, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding } from "@/hooks";

const CardUserPolicy = () => {
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
      title="Lovely to meet you, Nieuwoudt."
      description="A few things to know before we start working together: Helper text"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <div className="my-3 text-sm space-y-3 rounded-xl border border-navy-5 p-3 text-grey-15">
            <div className="flex">
              <div className="flex w-20 items-center">
                <Icon type="HandIcon" className="h-8" />
              </div>
              <p>
                Imali&apos;s Acceptable Use Policy prohibits using Claude for
                harm, like producing violent, abusive, or deceptive content.
              </p>
            </div>
            <div className="flex">
              <div className="flex w-20 items-center">
                <Icon type="ShieldIcon" className="h-8" />
              </div>
              <p>
                Imali&apos;s regularly reviews conversations flagged by our
                automated abuse detection, and may use them to improve our.
              </p>
            </div>
            <div className="flex">
              <div className="flex w-28 items-center">
                <Icon type="GradHatIcon" className="h-8" />
              </div>
              <p>
                Imali is not intended to give advice, including legal,
                financial, & medical advise. Don&apos;t rely on our conversation
                alone without doing your own independent research.
              </p>
            </div>
          </div>
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <Button size="xl" full type="submit">
            Acknowledge & Continue
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardUserPolicy };
