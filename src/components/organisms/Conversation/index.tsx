"use client";

import { Message, ListChartVisualizeButton } from "@/components/organisms";
import { useChat, useDynamicChart } from "@/hooks";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { DynamicChart, PaginationScroll } from "@/components/molecules";
import { MobileChartModal } from "../../molecules/MobileChartModal/MobileChartModal";
import { DesktopChartModal } from "../../molecules/DesktopChartModal/DesktopChartModal";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import clsx from "clsx";

interface ConversationProps {
  handleOpenModal: (id: string, chart: any) => void;
  isOpenChart: boolean;
}

const Conversation: FC<ConversationProps> = ({ handleOpenModal, isOpenChart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<any>(false);
  const { messages, isLoading } = useChat();
  const suggests = useSelector((state: RootState) => state.chat.suggests);

  const [streamText, setStreamText] = useState<string>("");
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      stateRef.current = true;
    }
    if (!isLoading && messages.length > 0 && stateRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.message_type !== "user") {
        const fullText = lastMessage.content;
        const words = fullText.split(/(\s+)/);
        const chunkSize = 15;
        let index = 0;
  
        const interval = setInterval(() => {
          index += chunkSize;
          setStreamText(words.slice(0, index).join(""));
  
          if (index >= words.length) {
            clearInterval(interval);
            setStreamText("");
            stateRef.current = false;
          }
        }, 100);
      }
    }
  }, [isLoading, messages]);
  

  return (
    <div
      className={clsx(
        "flex-1 overflow-hidden  max-w-[845px] mx-auto w-full relative flex flex-row gap-8 lg:pt-20 lg:pb-12",
        isOpenChart ? "" : ""
      )}
    >
      <div className={`w-full relative pb-32`}>
        <div
          className={cn(
            "react-scroll-to-bottom--css-ikyem-79elbk absolute inset-0",
            suggests ? "pb-52 md:pb-60" : "pb-28"
          )}
        >
          <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu custom-scrollbar flex flex-col items-center gap-2.5 md:gap-5 overflow-x-hidden pr-2">
            <PaginationScroll
              elements={undefined}
              fetchPagination={undefined}
              chatUUID={undefined}
              elementScroll={undefined}
            >
              {messages.map((message, index) => {
                const calculations = message.calculations
                  ? JSON.parse(message.calculations)
                  : null;

                const isLastMessage = index === messages.length - 1;
                return (
                  <Fragment key={message.id}>
                    <Message
                      text={
                        isLastMessage && !isLoading && message.message_type !== "user"
                          ? (stateRef.current ? streamText : message.content)
                          : message.content
                      }
                      date={""}
                      isUser={message.message_type === "user"}
                      isLastMessage={isLastMessage}
                    />
                    {calculations && (
                      <ListChartVisualizeButton
                        data={Object.entries(calculations)}
                        handleOpenModal={handleOpenModal}
                      />
                    )}
                  </Fragment>
                );
              })}
              {isLoading && (
                <Message
                  text={
                    <div className="flex items-end gap-4">
                      <span className="w-4 h-4">
                        <div className="small-loader" />
                      </span>
                      <span className="text-base font-normal leading-5 tracking-tight">
                        Answer
                      </span>
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
    </div>
  );
};

export { Conversation };
