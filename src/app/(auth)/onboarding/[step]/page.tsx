import { FC } from "react";
import { OnboardingStep as OnboardingStepComponent } from "@/components/templates";
import { RouteOnboardingValues } from "@/types";

interface StepProps {
  params: { step: RouteOnboardingValues };
}

const OnboardingStep: FC<StepProps> = ({ params }) => {
  return <OnboardingStepComponent step={params.step} />;
};

export default OnboardingStep;
