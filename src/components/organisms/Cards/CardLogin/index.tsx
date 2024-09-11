"use client";

import { CardTemplate } from "@/components/molecules";
import { Button, Field } from "@/components/atoms";
import { loginAction } from "@/utils/actions/user";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

const CardLogin = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleClickLogInButton = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await loginAction(formData);

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/onboarding");
        toast.success("Successfully logged in!");
      }
    });
  };

  return (
    <CardTemplate
      title="Login"
      description="To continue, please enter your password."
    >
      <form action={handleClickLogInButton}>
        <CardTemplate.Content className="flex flex-col gap-4 mt-4">
          <Field
            name="email"
            disabled={isPending}
            label={"Email"}
            full
            type="email"
          />
          <Field
            name="password"
            disabled={isPending}
            label={"Password"}
            full
            type="password"
          />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex flex-col gap-4 mt-4">
          <Button disabled={isPending} size="xl" full type="submit">
            {isPending ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
          <Button
            disabled={isPending}
            size="xl"
            variant="ghost"
            full
            href="/sign-up"
            as="link"
          >
            Sign up
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardLogin };
