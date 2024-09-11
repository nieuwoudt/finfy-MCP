import { LayoutLogin } from "@/layout";
import { ModalSignUp } from "@/components/molecules";

const SignUpSection = () => {
  return (
    <LayoutLogin
      classes={{
        informationContainerRight: "bg-primary",
        backgroundImage: "opacity-40",
      }}
    >
      <ModalSignUp />
    </LayoutLogin>
  );
};

export { SignUpSection };
