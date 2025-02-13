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

  const [showDetailed, setShowDetailed] = useState<boolean>(false);
  const [showCalculation, setShowCalculation] = useState<boolean>(false);
  const [streamText, setStreamText] = useState<string>("");
  useEffect(() => {
    // if (scrollRef.current) scrollRef.current.scrollIntoView();
  }, [messages]);

  const showHideDetailed = () => {
    setShowDetailed(!showDetailed)
  }
  const showHideCalculation = () => {
    setShowCalculation(!showCalculation)
  }

  useEffect(() => {
    if (isLoading) {
      stateRef.current = true;
    }
    if (!isLoading && messages.length > 0 && stateRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.message_type !== "user") {
        let output = null;

        if (
          lastMessage.content &&
          lastMessage.message_type !== "user" &&
          typeof lastMessage.content === "string"
        ) {
          try {
            output = JSON.parse(lastMessage.content);
          } catch (error) {
            // console.error("messagemessage Invalid JSON:", error);
            output = {
              answer: lastMessage.content,
              breakdown: "",
              table: "",
              text: ""
            }
          }
        }
        const fullText = output?.answer;
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

  // const objM = {
  //   "id": "920e8afa-392a-403d-ae8d-1e74ccd06339",
  //   "chat_id": "b55cdf1f-7dad-4afe-bb78-b4d1ae282815",
  //   "user_id": 66,
  //   "message_type": "bot",
  //   "created_at": "2024-10-24T08:06:27.790747+00:00",
  //   "is_processed": true,
  //   "response_time": null,
  //   "output": {
  //     "text": "**Total Spending in December 2024:** $1,520.53\n\n\n<details>\n<summary>Detailed breakdown</summary> Breakdown: Here's a detailed breakdown\n\n**December 2024:**\n- **December 2:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Insurance) at **Prudential**: $101.94\n  - LOAN_PAYMENTS (Other Payment) at **Small Business Administration**: $120.00\n- **December 9:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **Apple Card**: $98.59\n- **December 16:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **Barclays**: $250.00\n- **December 19:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000**: $500.00\n- **December 23:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000**: $450.00\n\n\n</details>\n\n<details>\n<summary>Table</summary>  Table\n\n| Date       | Category                  | Merchant                                                                 | Amount  |\n|------------|---------------------------|--------------------------------------------------------------------------|---------|\n| 2024-12-02 | General Services          | Prudential                                                               | $101.94 |\n| 2024-12-02 | Loan Payments             | Small Business Administration                                            | $120.00 |\n| 2024-12-09 | Loan Payments             | Apple Card                                                               | $98.59  |\n| 2024-12-16 | Loan Payments             | Barclays                                                                 | $250.00 |\n| 2024-12-19 | Loan Payments             | BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000            | $500.00 |\n| 2024-12-23 | Loan Payments             | BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000            | $450.00 |\n</details>",
  //     "answer": "**Total Spending in December 2024:** $1,520.53",
  //     "breakdown": "Breakdown: Here's a detailed breakdown\n\n**December 2024:**\n- **December 2:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Insurance) at **Prudential**: $101.94\n  - LOAN_PAYMENTS (Other Payment) at **Small Business Administration**: $120.00\n- **December 9:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **Apple Card**: $98.59\n- **December 16:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **Barclays**: $250.00\n- **December 19:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000**: $500.00\n- **December 23:**\n  - LOAN_PAYMENTS (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000**: $450.00",
  //     "table": "Table\n\n| Date       | Category                  | Merchant                                                                 | Amount  |\n|------------|---------------------------|--------------------------------------------------------------------------|---------|\n| 2024-12-02 | General Services          | Prudential                                                               | $101.94 |\n| 2024-12-02 | Loan Payments             | Small Business Administration                                            | $120.00 |\n| 2024-12-09 | Loan Payments             | Apple Card                                                               | $98.59  |\n| 2024-12-16 | Loan Payments             | Barclays                                                                 | $250.00 |\n| 2024-12-19 | Loan Payments             | BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000            | $500.00 |\n| 2024-12-23 | Loan Payments             | BK OF AMER VISA ONLINE PMT CKF816647972POS WEB ID: 9500000000            | $450.00 |"
  // },
  //   "calculations": "{\"spending_by_primary_category\":{\"name\":\"Spending by Category\",\"data\":{\"ENTERTAINMENT\":865,\"FOOD_AND_DRINK\":120,\"GENERAL_SERVICES\":963,\"HOME_IMPROVEMENT\":700,\"LOAN_PAYMENTS\":150,\"MEDICAL\":250,\"RENT_AND_UTILITIES\":1200,\"TRANSFER_OUT\":60,\"TRANSPORTATION\":75,\"TRAVEL\":450},\"chart_type\":\"bar\"},\"spending_by_primary_category_percentage\":{\"name\":\"Percentage\",\"data\":{\"ENTERTAINMENT\":17.9,\"FOOD_AND_DRINK\":2.48,\"GENERAL_SERVICES\":19.93,\"HOME_IMPROVEMENT\":14.48,\"LOAN_PAYMENTS\":3.1,\"MEDICAL\":5.17,\"RENT_AND_UTILITIES\":24.83,\"TRANSFER_OUT\":1.24,\"TRANSPORTATION\":1.55,\"TRAVEL\":9.31},\"chart_type\":\"pie\"},\"spending_by_date\":{\"name\":\"Spending by Date\",\"data\":{\"2023-01-15\":200,\"2023-01-20\":60,\"2023-01-30\":60,\"2023-02-10\":120,\"2023-02-28\":150,\"2023-03-12\":75,\"2023-04-21\":250,\"2023-04-28\":110,\"2023-05-05\":150,\"2023-05-20\":90,\"2023-06-20\":250,\"2023-07-10\":225,\"2023-07-11\":80,\"2023-07-14\":700,\"2023-07-22\":90,\"2023-08-12\":250,\"2023-08-25\":1200,\"2023-09-15\":150,\"2023-09-20\":200,\"2023-09-30\":30,\"2023-10-03\":108,\"2023-11-10\":40,\"2023-11-21\":90,\"2023-12-05\":75,\"2023-12-15\":80},\"chart_type\":\"line\"}}"
  // }


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
            (suggests && !messages.length) ? "pb-52 md:pb-60" : "pb-28"
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
                  let output = null;

                  if (
                    message.content &&
                    message.message_type !== "user" &&
                    typeof message.content === "string"
                  ) {
                    try {
                      output = JSON.parse(message.content);
                    } catch (error) {
                      // console.error("messagemessage Invalid JSON:", error);
                      output = {
                        answer: message.content,
                        breakdown: "",
                        table: "",
                        text: ""
                      }
                    }
                  }
                  
                const isLastMessage = index === messages.length - 1;
                return (
                  <Fragment key={message.id}>
                    <Message
                      text={
                        isLastMessage && !isLoading && message.message_type !== "user"
                          ? (stateRef.current ? streamText : (showDetailed ? output?.text : output?.answer))
                          // ? (stateRef.current ? streamText : (showDetailed ? output?.answer + ("\n\n\n<details>\n<summary>Detailed breakdown</summary>" + output?.breakdown + "\n</details>" +  "\n\n\n<details>\n<summary>Table breakdown</summary>" + output?.table + "\n</details>") : output?.answer))
                          : message.message_type !== "user" ? (showDetailed ? output?.answer + ("\n\n\n<details>\n<summary>Detailed breakdown</summary>" + output?.breakdown + "\n</details>" +  "\n\n\n<details>\n<summary>Table breakdown</summary>" + output?.table + "\n</details>") : output?.answer) : message?.content
                      }
                      date={""}
                      isUser={message.message_type === "user"}
                      isLastMessage={isLastMessage}
                      detailed={message.message_type !== "user" ? output?.breakdown + output?.table : ""}
                      calculations={message.message_type !== "user" ? calculations : ""}
                      showHideDetailed={showHideDetailed}
                      showDetailed={showDetailed}
                      showHideCalculation={showHideCalculation}
                    />
                    {(calculations && showCalculation) && (
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
