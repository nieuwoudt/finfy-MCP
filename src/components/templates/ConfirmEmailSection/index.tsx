import { LayoutLogin } from "@/layout";
import { ModalConfirmEmail } from "@/components/molecules";

const ConfirmEmailSection = () => {
  return (
    <LayoutLogin
      classes={{
        informationContainerRight: "bg-primary",
        backgroundImage: "opacity-40",
      }}
    >
      <ModalConfirmEmail />
    </LayoutLogin>
  );
};

export { ConfirmEmailSection };
