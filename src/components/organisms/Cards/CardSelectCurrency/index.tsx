"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, CurrencySelector } from "@/components/molecules";
import { useNavigationOnboarding } from "@/hooks";
import { RootState } from "@/lib/store";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { OptionsType } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CardSelectCurrency = () => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const [value, setValue] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const error = useSelector((state: RootState) => state.user.error);
  const status = useSelector((state: RootState) => state.user.statusUpdate);
  const dispatch = useAppDispatch();

  const handleCurrencyChange = (selectedOption: OptionsType) => {
    setValue(selectedOption.value);
  };

  const onSubmit = async () => {
    if (value && user?.id) {
      await dispatch(
        updateUser({
          selected_currency: value,
        })
      );
      toast.success("The chosen currency was successfully saved");
      nextStep();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate title="Choose your currency">
      <form action={onSubmit}>
        <CardTemplate.Content>
          <CurrencySelector onChange={handleCurrencyChange} />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex justify-between items-center mt-6">
          <Button
            size="xl"
            onClick={prevStep}
            type="button"
            variant="destructive"
            className="!rounded-md"
          >
            Back
          </Button>
          <Button
            size="xl"
            type={"submit"}
            disabled={!value || status === "loading"}
            className="!rounded-md"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardSelectCurrency };
