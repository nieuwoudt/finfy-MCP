"use client";

import { Button } from "@/components/atoms";
import { CardTemplate, CurrencySelector } from "@/components/molecules";
import { useGetUser, useNavigationOnboarding } from "@/hooks";
import { RootState } from "@/lib/store";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { SingleValue } from "react-select";

const CardSelectCurrency = () => {
  const user = useGetUser();
  const { nextStep, prevStep } = useNavigationOnboarding();
  const error = useSelector((state: RootState) => state.user.error);
  const status = useSelector((state: RootState) => state.user.status);
  const dispatch = useAppDispatch();

  const {
    setValue,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleCurrencyChange = (
    selectedOption: SingleValue<{ value: string; label: JSX.Element }>
  ) => {
    if (selectedOption) setValue("currency", selectedOption.value || "ZAR");
  };

  const onSubmit = async () => {
    nextStep();
  };

  useEffect(() => {
    if (status === "succeeded") {
      nextStep();
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate title="Choose your currency">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardTemplate.Content>
          <CurrencySelector onChange={handleCurrencyChange} />
        </CardTemplate.Content>
        <CardTemplate.Footer className="flex justify-between items-center mt-6">
          <Button size="xl" onClick={prevStep} className="!rounded-md">
            Back
          </Button>
          <Button size="xl" type={"submit"} className="!rounded-md">
            Continue
          </Button>
        </CardTemplate.Footer>
      </form>
    </CardTemplate>
  );
};

export { CardSelectCurrency };
