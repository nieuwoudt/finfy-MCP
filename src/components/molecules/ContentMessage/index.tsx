"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  const transformMarkdownContent = (text: string) => {
    // Convert the link to an image if it matches the pattern: (alt text)(URL)
    return text.replace(
      /\(([^)]+)\)\((https?:\/\/[^\s]+)\)/g,
      "![$1]($2)"
    );
  };

  // Transform the content if it's a string
  const transformedText =
    typeof text === "string" ? transformMarkdownContent(text) : text;

  
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
        {isUser || isLoading ? text : <Markdown className={"markdown !whitespace-normal markdown-special"} remarkPlugins={[remarkGfm]}>{transformedText as string}</Markdown>}
      </p>
    </div>
  );
};

export { ContentMessage };
