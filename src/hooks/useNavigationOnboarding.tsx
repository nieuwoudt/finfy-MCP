import { useParams, useRouter } from "next/navigation";
import { stepsOnboarding } from "@/utils/variables";
import { RouteOnboardingValues } from "@/types";

const useNavigationOnboarding = () => {
  const params = useParams();
  const route = useRouter();

  const currentStep: RouteOnboardingValues =
    (params.step as RouteOnboardingValues) ||
    (stepsOnboarding.at(0) as RouteOnboardingValues);

  const indexCurrentStep = stepsOnboarding.indexOf(currentStep);

  const nextStep = (params: string = "") => {
    route.push(
      `/onboarding/${stepsOnboarding?.at(indexCurrentStep + 1)}` + params
    );
  };
  const prevStep = () => {
    route.push(`/onboarding/${stepsOnboarding?.at(indexCurrentStep - 1)}`);
  };

  return {
    nextStep,
    prevStep,
    currentStep,
  };
};

export { useNavigationOnboarding };
