import {
  CardVerifyPhoneNumber,
  CardConfirmPhoneNumber,
  CardSelectPlan,
  CardPersonalize,
  CardUserPolicy,
  CardFinalUserPolicy,
  CardLinkAccount,
  CardSelectCurrency,
  CardSetupComplete,
  CardSelectCountry
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
  [routesOnboarding.selectCountry]: CardSelectCountry,
  [routesOnboarding.connectBank]: CardLinkAccount,
  [routesOnboarding.selectCurrency]: CardSelectCurrency,
  [routesOnboarding.setupComplete]: CardSetupComplete,
};

const OnboardingStep: FC<OnboardingStepPops> = ({ step }) => {
  const CurrentStep = stepComponents[step];
  if (!CurrentStep) {
    return null;
  }
  return <CurrentStep />;
};

export { OnboardingStep };
