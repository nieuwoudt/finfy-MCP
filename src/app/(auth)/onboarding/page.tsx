import { OnboardingPage } from "@/components/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Finfy",
  description: "Chat",
};

const Onboarding = async () => {
  return <OnboardingPage />;
};

export default Onboarding;
