import { ContentMessage } from "@/components/molecules";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { FC, ReactNode } from "react";

interface MessageProps {
  text: ReactNode;
  isUser: boolean;
  date?: string;
}

const Message: FC<MessageProps> = (props) => {
  const { text, isUser } = props;

  return (
    <>
      <article className="w-full relative">
        <div className={"flex gap-2.5 select-none w-full justify-start"}>
          <div
            className={cn(
              "message relative inline-block text-white rounded-md px-2 py-1 md:px-4 md:py-2"
            )}
          >
            <ContentMessage text={text} isUser={isUser} />
          </div>
        </div>
      </article>
    </>
  );
};

export { Message };
