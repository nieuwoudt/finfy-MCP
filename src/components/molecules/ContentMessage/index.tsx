import { FC, ReactNode } from "react";

interface ContentMessageProps {
  text: ReactNode;
}

const ContentMessage: FC<ContentMessageProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <p
        className={
          "whitespace-pre-line font-normal text-xs leading-[14px] md:text-lg md:leading-8"
        }
      >
        {text}
      </p>
    </div>
  );
};

export { ContentMessage };
