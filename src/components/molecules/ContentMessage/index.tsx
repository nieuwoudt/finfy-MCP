"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
import Markdown from "react-markdown";
interface ContentMessageProps {
  text: ReactNode;
  isUser: boolean;
  isLoading?: boolean;
  isLastMessage?: boolean;
}

const ContentMessage: FC<ContentMessageProps> = ({
  text,
  isUser,
  isLoading,
  isLastMessage,
}) => {
  if (!text) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {!isUser && !isLoading && (
        <div className="flex items-end gap-4  mb-4">
          <span className="w-4 h-4">
            <Icon type="SmallLogo" />
          </span>
          <span className="text-white text-2xl leading-3 font-medium">
            {isLastMessage ? "Answer" : "Finfy"}
          </span>
        </div>
      )}
      <p
        className={cn(
          "whitespace-pre-line text-white font-normal leading-[14px] md:leading-8",
          isUser
            ? "text-2xl md:text-4xl font-bold flex gap-2.5 items-center"
            : "text-sm md:text-base"
        )}
      >
        {isUser || isLoading ? text : <Markdown>{text as string}</Markdown>}
      </p>
    </div>
  );
};

export { ContentMessage };
