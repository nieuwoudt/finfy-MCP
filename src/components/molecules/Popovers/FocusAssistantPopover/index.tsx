"use client";

import { Popover } from "@/components/atoms";
import { FC, PropsWithChildren } from "react";
import { FocusAssistantOption } from "@/components/molecules";

interface FocusAssistantPopoverProps extends PropsWithChildren {}

const mockData = [
  {
    title: "💼 Financial Coaching",
    text: "Personalized financial advice for better planning.",
  },
  {
    title: "🛒 Product Recommendation",
    text: "Tailored product saggestions to fit your needs.",
  },
  {
    title: "👥 Connect with a Human Advisor",
    text: "Instantly connect with a financial expert.",
  },
  {
    title: "📝 Enquire About Claims",
    text: "Get help with filing and tracking claims.",
  },
];

const FocusAssistantPopover: FC<FocusAssistantPopoverProps> = ({
  children,
}) => {
  return (
    <Popover>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content side="top" align="start" className="mb-4 max-w-3xl">
        <Popover.Header className="mb-6">
          <span>Focus Assistant</span>
        </Popover.Header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockData.map((item, index) => {
            return (
              <FocusAssistantOption
                title={item.title}
                text={item.text}
                key={index}
              />
            );
          })}
        </div>
      </Popover.Content>
    </Popover>
  );
};

export { FocusAssistantPopover };
