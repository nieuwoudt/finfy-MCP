"use client";

import { ChatMessageInput } from "@/components/molecules";
import { ActionButtonsGroup, SuggestedQuestions } from "@/components/organisms";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface AssistInputProps {
  classes?: {
    container?: string;
    wrapper?: string;
  };
  handleClose?: () => void;
  isDark?: boolean;
}

const AssistInput: FC<AssistInputProps> = ({ classes, handleClose, isDark = false }) => {
  return (
    <div
      className={cn(
        "flex flex-col fixed lg:left-0 right-2 left-2 lg:right-0 bottom-2 lg:bottom-0 md:left-auto md:right-auto md:bottom-auto md:relative rounded-full lg:rounded-none",
        classes?.wrapper
      )}
    >
      <div
        className={cn(
          "w-full md:p-2 bottom-0 xl:bottom-72 absolute bg-navy-15 lg:bg-transparent rounded-full lg:rounded-none",
          classes?.container
        )}
      >
        <SuggestedQuestions />
        {/* <ActionButtonsGroup /> */}
        <ChatMessageInput isDark={isDark} handleClose={handleClose} />
      </div>
    </div>
  );
};

export { AssistInput };
