"use client";

import { CardTemplate } from "@/components/molecules";
import { useTransition } from "react";
import { Button, Field } from "@/components/atoms";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/utils/actions/user";
import { Loader2 } from "lucide-react";

const CardSignUp = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleClickSignUpButton = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await createAccountAction(formData);

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/confirm-email");
        toast.success("A verification link has been sent to your email!");
      }
    });
  };
  return (
    <CardTemplate title="Sign Up">
      <form action={handleClickSignUpButton}>
        <CardTemplate.Content className="flex flex-col gap-4 mt-4">
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
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex flex-col gap-4 mt-4">
          <Button disabled={isPending} type="submit" size="xl" full>
            {isPending ? <Loader2 className="animate-spin" /> : "Sign up"}
          </Button>
          <Button
            disabled={isPending}
            size="xl"
            variant="ghost"
            full
            href="/login"
            as="link"
          >
            Log In
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardSignUp };
