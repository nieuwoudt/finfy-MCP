"use client";

import { CustomButtonIcon, Icon } from "@/components/atoms";
import { CardTemplate } from "@/components/molecules";
import { useNavigationOnboarding } from "@/hooks";

const buttonData = [
  {
    icon: <Icon type="UserIcon" className="h-8 text-grey-15" />,
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

  const handleCodeChange = async (code: string) => {
    nextStep();
  };

  return (
    <CardTemplate
      title="How are you planning to use Imali?"
      classes={{
        cardTitle: "text-center",
        card: "max-w-xl",
      }}
    >
      <CardTemplate.Content>
        <div className="flex flex-col md:flex-row gap-2">
          {buttonData.map((button, index) => (
            <CustomButtonIcon
              key={index}
              icon={button.icon}
              title={button.title}
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
