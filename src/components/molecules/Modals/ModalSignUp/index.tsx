"use client";
import { useTransition } from "react";
import { Modal, Button, Field } from "@/components/atoms";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/utils/actions/user";
import { Loader2 } from "lucide-react";

const ModalSignUp = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleClickSignUpButton = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await createAccountAction(formData);

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/confirm-email");
        toast.success("Account created!");
      }
    });
  };
  return (
    <Modal
      open={true}
      classes={{
        wrapper: "max-w-lg !absolute",
        container: "flex flex-col gap-4",
      }}
      isDisabledPortal
    >
      <form action={handleClickSignUpButton}>
        <Modal.Header>
          <h3 className="text-white text-2xl text-start font-bold">Sign Up</h3>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-4 mt-4">
          <Field
            name="email"
            label={"Email"}
            full
            type="email"
            disabled={isPending}
          />
          <Field
            name="password"
            label={"Password"}
            full
            type="password"
            disabled={isPending}
          />
        </Modal.Body>
        <Modal.Footer className="flex flex-col gap-4 mt-4">
          <Button disabled={isPending} type="submit" size="xl" full>
            {isPending ? <Loader2 className="animate-spin" /> : "Sign up"}
          </Button>
          <Button
            disabled={isPending}
            size="xl"
            variant="plain"
            full
            href="/login"
            as="link"
          >
            Log In
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export { ModalSignUp };
