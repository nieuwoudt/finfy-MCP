"use client";

import { Message, ListChartVisualizeButton } from "@/components/organisms";
import { PaginationScroll } from "@/hoc";
import { useChat } from "@/hooks";
import { formatSnakeCaseToTitleCase } from "@/utils/helpers";
import { Loader2 } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

const Conversation = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading } = useChat();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className={"flex-1 overflow-hidden relative"}>
      <div className="react-scroll-to-bottom--css-ikyem-79elbk absolute inset-0 pb-[110px] mb-8">
        <div
          className={
            "react-scroll-to-bottom--css-ikyem-1n7m0yu custom-scrollbar flex flex-col items-center gap-2.5 md:gap-5 overflow-x-hidden pr-2"
          }
        >
          <PaginationScroll
            elements={undefined}
            fetchPagination={undefined}
            chatUUID={undefined}
            elementScroll={undefined}
          >
            {messages.map((message) => {
              const calculations = message.calculations
                ? JSON.parse(message.calculations)
                : null;
              return (
                <Fragment key={message.id}>
                  <Message
                    text={message.content}
                    date={""}
                    isUser={message.message_type === "user"}
                  />
                  {calculations && (
                    <ListChartVisualizeButton
                      data={Object.entries(calculations)}
                    />
                  )}
                </Fragment>
              );
            })}
            {isLoading && (
              <Message
                text={
                  <div className="flex items-center gap-1">
                    Your data is being analyzed, this might take a moment...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                }
                isUser={false}
                isLoading={isLoading}
              />
            )}
            <div ref={scrollRef} />
          </PaginationScroll>
        </div>
      </div>
    </div>
  );
};

export { Conversation };
