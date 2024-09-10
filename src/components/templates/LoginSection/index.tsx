import { LayoutLogin } from "@/layout";
import { ModalLogin } from "@/components/molecules";

const LoginSection = () => {
  return (
    <LayoutLogin
      classes={{
        informationContainerRight: "bg-primary",
        backgroundImage: "opacity-40",
      }}
    >
      <ModalLogin />
    </LayoutLogin>
  );
};

export { LoginSection };
