"use client";

import { Button, Field, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useForm } from "react-hook-form";
import { useNavigationOnboarding, useUser } from "@/hooks";

const CardUserPolicy = () => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const { user } = useUser();
  const {
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async () => {
    nextStep();
  };

  return (
    <CardTemplate
      title={`Lovely to meet you, ${user.name || "new user"}.`}
      description="A few things to know before we start working together"
      classes={{
        card: "max-w-xl",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <div className="my-3 text-sm space-y-3 rounded-xl border border-navy-5 p-3 text-grey-15">
            <div className="flex gap-2">
              <div className="flex flex-col w-20 items-center">
                <Icon type="HandIcon" />
              </div>
              <div className="flex flex-col  gap-2">
                <p>
                  <b>Acceptable Use Policy:</b>
                  Finfy promotes a safe and respectful environment. Users must not use it to create, share, or promote harmful, abusive, or deceptive content.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex w-20 items-center">
                <Icon type="ShieldIcon" />
              </div>
              <p>
                <b>Monitoring and Improvement:</b>
                To ensure quality and safety, Finfy may review conversations flagged by automated systems. These reviews help us improve while protecting user privacy.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex w-20 items-center">
                <Icon type="ShieldIcon" />
              </div>
              <p>
                <b>Advisory Disclaimer:</b>
                Finfy offers general guidance and is not a substitute for professional advice (legal, financial, medical, etc.). Please consult a professional for critical decisions.

              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex w-28 items-center">
                <Icon type="GradHatIcon" />
              </div>
              <p>
                <b>Advisory Disclaimer:</b>
                Finfy offers general guidance and is not a substitute for professional advice (legal, financial, medical, etc.). Please consult a professional for critical decisions.

              </p>
            </div>
          </div>
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <Button size="xl" type="button" onClick={prevStep} variant="destructive" full>
            Back
          </Button>
          <Button size="xl" full type="submit">
            Acknowledge & Continue
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardUserPolicy };
