import { OnboardingPage } from "@/components/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Finfy",
  description: "Chat",
};

const Onboarding = () => {
  return <OnboardingPage />;
};

export default Onboarding;
