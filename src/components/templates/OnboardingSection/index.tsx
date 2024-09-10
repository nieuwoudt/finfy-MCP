import { LayoutLogin } from "@/layout";
import { ModalOnboarding } from "@/components/molecules";

const OnboardingSection = () => {
  return (
    <LayoutLogin
      classes={{
        informationContainerRight: "bg-deep-navy",
        backgroundImage: "opacity-20",
      }}
    >
      <ModalOnboarding />
    </LayoutLogin>
  );
};

export { OnboardingSection };
