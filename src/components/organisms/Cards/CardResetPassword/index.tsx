"use client";

import { CardTemplate } from "@/components/molecules";
import { Button, Field } from "@/components/atoms";
import { resetPasswordForEmail } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { resetCookies } from "@/utils/helpers";

const CardResetPassword = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      resetCookies();
      const { errorMessage } = await resetPasswordForEmail(formData);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/send-reset-password");
        toast.success("The reset email has been sent successfully.");
      }
    });
  };

  return (
    <CardTemplate
      title="Reset Password"
      description="Enter your email address below, and we'll send you instructions to reset your password."
    >
      <form action={onSubmit}>
        <CardTemplate.Content className="flex flex-col gap-4 mt-4">
          <Field
            name="email"
            disabled={isPending}
            label={"Email"}
            full
            type="email"
          />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-4 mt-4 w-full">
            <Button disabled={isPending} size="xl" full type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : "Reset"}
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
          </div>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardResetPassword };
