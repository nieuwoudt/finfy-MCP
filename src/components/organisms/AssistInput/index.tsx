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
        "flex flex-col fixed left-0 right-0 bottom-0 md:left-auto md:right-auto md:bottom-auto md:relative",
        classes?.wrapper
      )}
    >
      <div
        className={cn(
          "w-full md:p-2 bottom-0 absolute bg-navy-15 md:bg-transparent",
          classes?.container
        )}
      >
        <SuggestedQuestions />
        <ActionButtonsGroup />
        <ChatMessageInput isDark={isDark} handleClose={handleClose} />
      </div>
    </div>
  );
};

export { AssistInput };
