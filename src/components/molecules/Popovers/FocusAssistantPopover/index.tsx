"use client";

import { Popover } from "@/components/atoms";
import { FC, PropsWithChildren } from "react";
import { FocusAssistantOption } from "@/components/molecules";
import { useAppSelector } from "@/lib/store/hooks";

interface FocusAssistantPopoverProps extends PropsWithChildren {}

const FocusAssistantPopover: FC<FocusAssistantPopoverProps> = ({
  children,
}) => {
  const focusData = useAppSelector((state) => state.suggest.focusSuggests);
  return (
    <Popover>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content side="top" align="start" className="mb-4 max-w-3xl">
        <Popover.Header className="mb-6">
          <span>Focus Assistant</span>
        </Popover.Header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {focusData.map((item: any, index: number) => {
            return (
              <FocusAssistantOption
                title={item.title}
                text={item.text}
                key={index}
                suggest={item.suggest}
              />
            );
          })}
        </div>
      </Popover.Content>
    </Popover>
  );
};

export { FocusAssistantPopover };
