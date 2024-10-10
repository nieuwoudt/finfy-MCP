"use client";

import { CustomButtonIcon, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useGetUser, useNavigationOnboarding } from "@/hooks";
import { RootState } from "@/lib/store";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const buttonData = [
  {
    icon: <Icon type="UserIcon" className="h-8 w-8 stroke-grey-15" />,
    title: "For personal use",
    case: "personal",
    description: "Refine ideas, analyze data, summarize documents, and more.",
  },
  {
    icon: <Icon type="UserGroupIcon" className="h-8 text-grey-15" />,
    title: "For my team",
    case: "team",
    description:
      "Get higher usage limits and early access to collaborative features.",
  },
  {
    icon: <Icon type={"DollarBankIcon"} className="h-10 w-10 text-grey-15" />,
    title: "For my business",
    case: "business",
    description: "Refine ideas, analyze data, summarize documents, and more.",
  },
];

const CardSelectPlan = () => {
  const { nextStep } = useNavigationOnboarding();
  const userCurrent = useSelector((state: RootState) => state.user.user);
  const error = useSelector((state: RootState) => state.user.error);
  const status = useSelector((state: RootState) => state.user.statusUpdate);
  const dispatch = useAppDispatch();

  const handleCodeChange = async (plan: string) => {
    if (userCurrent?.id) {
      await dispatch(updateUser({ plan }));
      nextStep();
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CardTemplate
      title="How are you planning to use Imali?"
      classes={{
        cardTitle: "text-center",
        card: "max-w-xl",
      }}
    >
      <CardTemplate.Content>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {buttonData.map((button, index) => (
            <CustomButtonIcon
              key={index}
              icon={button.icon}
              title={button.title}
              disabled={status === "loading"}
              description={button.description}
              onClick={() => handleCodeChange(button.case)}
            />
          ))}
        </div>
      </CardTemplate.Content>
    </CardTemplate>
  );
};

export { CardSelectPlan };
