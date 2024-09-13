"use client";

import { Button, Field } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useNavigationOnboarding } from "@/hooks";
import { useTransition } from "react";
import { verifyPhoneUser } from "@/lib/supabase/actions";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const CardConfirmPhoneNumber = () => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") as string;
  const { nextStep } = useNavigationOnboarding();

  const onSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const code = formData.get("code") as string;
      const { errorMessage } = await verifyPhoneUser(phone, code);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        nextStep();
        toast.success("Phone number has been successfully verified!");
      }
    });
  };

  return (
    <CardTemplate
      title="First, let's create your account"
      description={`Please enter the code sent via text to: ${phone}`}
    >
      <form action={onSubmit}>
        <CardTemplate.Content>
          <Field disabled={isPending} full name={"code"} />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex gap-4 mt-4">
          <div className="w-full">
            <Button disabled={isPending} size="xl" full type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify & Create Account"
              )}
            </Button>
            <p className="text-sm text-grey-15 mt-4">
              Not seeing the code? Try again
            </p>
          </div>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardConfirmPhoneNumber };
