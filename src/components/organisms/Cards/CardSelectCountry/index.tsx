"use client";

import { Button } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useNavigationOnboarding } from "@/hooks";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { CountrySelector } from "@/components/molecules/CountrySelector"; // Імпортуємо компонент
import { OptionsType } from "@/types/common";
import { updateUser } from "@/lib/store/features/user/userSlice";

const CardSelectCountry = () => {
  const { nextStep, prevStep } = useNavigationOnboarding();
  const [value, setValue] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const error = useSelector((state: RootState) => state.user.error);
  const status = useSelector((state: RootState) => state.user.statusUpdate);
  const dispatch = useAppDispatch();

  const handleCountryChange = (selectedOption: OptionsType) => {
    setValue(selectedOption.value);
  };

  const onSubmit = async () => {
    if (value && user?.id) {
      await dispatch(
        updateUser({
          selected_country: value,
        })
      );
    }
  };

  useEffect(() => {
    if (status === "succeeded" && user?.selected_country) {
      toast.success("The chosen country was successfully saved");
      nextStep();
    }
  }, [status, user?.selected_country]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate title="Choose your country">
      <form onSubmit={onSubmit}>
        <CardTemplate.Content>
          <CountrySelector onChange={handleCountryChange} />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex justify-between items-center mt-6">
          <Button
            size="xl"
            onClick={prevStep}
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

export { CardSelectCountry };
