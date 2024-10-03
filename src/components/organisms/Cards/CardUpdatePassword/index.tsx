"use client";

import { CardTemplate } from "@/components/molecules";
import { Button, Field } from "@/components/atoms";
import { updatePassword } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { resetCookies } from "@/utils/helpers";

const CardUpdatePassword = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      resetCookies();
      const { errorMessage } = await updatePassword(formData);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/login");
        toast.success("Password successfully updated!");
      }
    });
  };

  return (
    <CardTemplate title="Update Password" description="Enter a new password">
      <form action={onSubmit}>
        <CardTemplate.Content className="flex flex-col gap-4 mt-4">
          <Field
            name="password"
            disabled={isPending}
            label={"Password"}
            full
            type="password"
          />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-4 mt-4 w-full">
            <Button disabled={isPending} size="xl" full type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
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

export { CardUpdatePassword };
