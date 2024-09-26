"use client";

import { CardTemplate } from "@/components/molecules";
import { useTransition } from "react";
import { Button, Field } from "@/components/atoms";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createAccountAction } from "@/lib/supabase/actions";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { createUser } from "@/lib/store/features/user/userSlice";
import { getErrorMessage } from "@/utils/helpers";
// import {d} from 'cookies-next';

const CardSignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const handleClickSignUpButton = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const ERROR_DUPLICATE_CODE = "23505";
      try {
        const data: any = await dispatch(createUser({ email }));
        if (data?.error?.code !== ERROR_DUPLICATE_CODE) {
          const { errorMessage } = await createAccountAction(formData);
          if (errorMessage) {
            toast.error(errorMessage);
          } else {
            router.push("/confirm-email");
            toast.success("A verification link has been sent to your email!");
          }
        } else {
          toast.error("This user is already registered");
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
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
