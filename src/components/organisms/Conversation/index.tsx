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
import * as Sentry from "@sentry/nextjs";

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
    try {
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
    } catch (err) {
      console.log("shift_err", err)
      Sentry.captureException(err)
      if (!isLoading && messages.length > 0 && stateRef.current) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.message_type !== "user") {
          const fullText = lastMessage.content;
          setStreamText(fullText);
        }
      }
    }

  }, [isLoading, messages]);

  // const objM = {
  //   "id": "920e8afa-392a-403d-ae8d-1e74ccd06339",
  //   "chat_id": "b55cdf1f-7dad-4afe-bb78-b4d1ae282815",
  //   "user_id": 66,
  //   "message_type": "bot",
  //   "content": "**Total Spending for Last Year: $4833.000000**",
  //   "detailed": "\n\n\n<details>\n<summary>Detailed breakdown</summary> Breakdown: Here’s a detailed breakdown of your spending by date and merchant:\n\n**January 2023:**\n- **January 15:**\n  - ![](https://app.finfy.ai/icons/export/TRAVEL.png) Travel (Flights) at **Delta Airlines**: $200.00\n- **January 20:**\n  - ![](https://app.finfy.ai/icons/export/TRANSFER_IN.png) Transfer Out (Other Transfer Out) at **PayPal**: $60.00\n- **January 30:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Sporting Events, Amusement Parks, and Museums) at **Thrill Land Amusement Park**: $60.00\n\n**February 2023:**\n- **February 10:**\n  - ![](https://app.finfy.ai/icons/export/FOOD_AND_DRINK.png) Food and Drink (Groceries) at **Walmart Grocery**: $120.00\n- **February 28:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Education) at **SkillUp Online Course**: $150.00\n\n**March 2023:**\n- **March 12:**\n  - ![](https://app.finfy.ai/icons/export/TRANSPORTATION.png) Transportation (Gas) at **Exxon Mobil**: $75.00\n\n**April 2023:**\n- **April 21:**\n  - ![](https://app.finfy.ai/icons/export/TRAVEL.png) Travel (Lodging) at **Marriott Hotel Stay**: $250.00\n- **April 28:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Other General Services) at **Home Solutions**: $110.00\n\n**May 2023:**\n- **May 5:**\n  - Loan Payments (Credit Card Payment) at **Chase Credit Card Payment**: $150.00\n- **May 20:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Music and Audio) at **Classical Concert**: $90.00\n\n**June 2023:**\n- **June 20:**\n  - ![](https://app.finfy.ai/icons/export/MEDICAL.png) Medical (Pharmacies and Supplements) at **Walgreens**: $250.00\n\n**July 2023:**\n- **July 10:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Storage) at **SafeSpace Storage**: $225.00\n- **July 11:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Sporting Events, Amusement Parks, and Museums) at **Adventure World**: $80.00\n- **July 14:**\n  - ![](https://app.finfy.ai/icons/export/HOME_IMPROVEMENT.png) Home Improvement (Furniture) at **IKEA Furniture Purchase**: $700.00\n- **July 22:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Video Games) at **Steam Game Purchase**: $90.00\n\n**August 2023:**\n- **August 12:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Automotive) at **Coastal Car Repair**: $250.00\n- **August 25:**\n  - ![](https://app.finfy.ai/icons/export/RENT_AND_UTILITIES.png) Rent and Utilities (Rent) at **Apartment Complex**: $1200.00\n\n**September 2023:**\n- **September 15:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Music and Audio) at **Jazz Festival**: $150.00\n- **September 20:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Casinos and Gambling) at **Pirate's Cove Casino**: $200.00\n- **September 30:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Postage and Shipping) at **USPS Shipping**: $30.00\n\n**October 2023:**\n- **October 3:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Childcare) at **Tots Playcare**: $108.00\n\n**November 2023:**\n- **November 10:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Music and Audio) at **Rock Concert**: $40.00\n- **November 21:**\n  - ![](https://app.finfy.ai/icons/export/GENERAL_SERVICES.png) General Services (Consulting and Legal) at **Smith & Associates Law Firm**: $90.00\n\n**December 2023:**\n- **December 5:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (Casinos and Gambling) at **Royal Palace Casino**: $75.00\n- **December 15:**\n  - ![](https://app.finfy.ai/icons/export/ENTERTAINMENT.png) Entertainment (TV and Movies) at **StreamFlix Subscription**: $80.00\n\n\n</details>\n\n<details>\n<summary>Table</summary>  Table\n\n| Date       | Category      | Merchant                     | Amount |\n|------------|---------------|------------------------------|--------|\n| 2023-01-15 | Travel        | Delta Airlines               | $200.00|\n| 2023-01-20 | Transfer Out  | PayPal                       | $60.00 |\n| 2023-01-30 | Entertainment | Thrill Land Amusement Park   | $60.00 |\n| 2023-02-10 | Food and Drink| Walmart Grocery              | $120.00|\n| 2023-02-28 | General Services | SkillUp Online Course    | $150.00|\n| 2023-03-12 | Transportation| Exxon Mobil                  | $75.00 |\n| 2023-04-21 | Travel        | Marriott Hotel Stay          | $250.00|\n| 2023-04-28 | General Services | Home Solutions           | $110.00|\n| 2023-05-05 | Loan Payments | Chase Credit Card Payment    | $150.00|\n| 2023-05-20 | Entertainment | Classical Concert            | $90.00 |\n| 2023-06-20 | Medical       | Walgreens                    | $250.00|\n| 2023-07-10 | General Services | SafeSpace Storage        | $225.00|\n| 2023-07-11 | Entertainment | Adventure World              | $80.00 |\n| 2023-07-14 | Home Improvement | IKEA Furniture Purchase  | $700.00|\n| 2023-07-22 | Entertainment | Steam Game Purchase          | $90.00 |\n| 2023-08-12 | General Services | Coastal Car Repair       | $250.00|\n| 2023-08-25 | Rent and Utilities | Apartment Complex      | $1200.00|\n| 2023-09-15 | Entertainment | Jazz Festival                | $150.00|\n| 2023-09-20 | Entertainment | Pirate's Cove Casino         | $200.00|\n| 2023-09-30 | General Services | USPS Shipping            | $30.00 |\n| 2023-10-03 | General Services | Tots Playcare            | $108.00|\n| 2023-11-10 | Entertainment | Rock Concert                 | $40.00 |\n| 2023-11-21 | General Services | Smith & Associates Law Firm | $90.00 |\n| 2023-12-05 | Entertainment | Royal Palace Casino          | $75.00 |\n| 2023-12-15 | Entertainment | StreamFlix Subscription      | $80.00 |\n</details>",
  //   "created_at": "2024-10-24T08:06:27.790747+00:00",
  //   "is_processed": true,
  //   "response_time": null,
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

                const isLastMessage = index === messages.length - 1;
                return (
                  <Fragment key={message.id}>
                    <Message
                      text={
                        isLastMessage && !isLoading && message.message_type !== "user"
                          ? (stateRef.current ? streamText : (showDetailed ? message?.content + message?.detailed : message?.content))
                          : message.content
                      }
                      date={""}
                      isUser={message.message_type === "user"}
                      isLastMessage={isLastMessage}
                      detailed={message.message_type !== "user" ? message?.detailed : ""}
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
