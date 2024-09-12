import {
  CardVerifyPhoneNumber,
  CardConfirmPhoneNumber,
  CardSelectPlan,
  CardPersonalize,
  CardUserPolicy,
  CardFinalUserPolicy,
  CardLinkAccount,
} from "@/components/organisms";
import { RouteOnboardingValues } from "@/types";
import { routesOnboarding } from "@/utils/variables";
import { FC } from "react";

interface OnboardingStepPops {
  step: RouteOnboardingValues;
}

const stepComponents: {
  [key: string]: () => JSX.Element;
} = {
  [routesOnboarding.verifyPhoneNumber]: CardVerifyPhoneNumber,
  [routesOnboarding.confirmPhoneNumber]: CardConfirmPhoneNumber,
  [routesOnboarding.selectPlan]: CardSelectPlan,
  [routesOnboarding.personalize]: CardPersonalize,
  [routesOnboarding.userPolicy]: CardUserPolicy,
  [routesOnboarding.finalUserPolicy]: CardFinalUserPolicy,
  [routesOnboarding.connectBank]: CardLinkAccount,
};

const OnboardingStep: FC<OnboardingStepPops> = ({ step }) => {
  const CurrentStep = stepComponents[step];
  if (!CurrentStep) {
    return null;
  }
  return <CurrentStep />;
};

export { OnboardingStep };
