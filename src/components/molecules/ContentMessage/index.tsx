"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import clsx from "clsx";

interface ContentMessageProps {
  text: ReactNode;
  isUser: boolean;
  isLoading?: boolean;
  isLastMessage?: boolean;
  showHideCalculation?: any;
}

const ContentMessage: FC<ContentMessageProps> = ({
  text: oooo,
  isUser,
  isLoading,
  isLastMessage,
  showHideCalculation
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  console.log("texttexttext", oooo)

  const text = isUser ? oooo :  `
  In the last month, you spent a total of **$23,275.16**. This includes various categories such as **loan payments, general merchandise, food and drink, and more**. The largest portion of your spending was on **loan payments ($12,055.09)**. 
  
  To save money, consider reviewing your **loan payment plans** and exploring options for **refinancing or consolidating debts**. Additionally, tracking your spending in categories like **food and drink** can help identify areas for potential savings.
  
  <div class="details-container">
  <details>
  <summary >Visualise Breakdown</summary>
  </details>
  <details>
  <summary >Detailed breakdown</summary>
  
  **January 2025:**  
  - **January 2:** General Services (Insurance) at **Prudential**: $101.94, Loan Payments (Credit Card Payment) at **Apple Card**: $133.57, Loan Payments (Credit Card Payment) at **Barclays**: $6,405.09, Loan Payments (Other Payment) at **Small Business Administration**: $120.00  
  - **January 13:** Loan Payments (Credit Card Payment) at **Apple Card**: $5,021.43  
  - **January 15:** General Merchandise (Other) at **FUN**: $89.40  
  - **January 16:** Food and Drink (Coffee) at **Starbucks**: $4.33, Food and Drink (Fast Food) at **McDonald's**: $12.00  
  - **January 17:** Personal Care (Gyms and Fitness Centers) at **Touchstone Climbing**: $78.50, Travel (Flights) at **United Airlines**: $500.00  
  - **January 18:** General Merchandise (Other) at **CD DEPOSIT .INITIAL.**: $1,000.00, General Services (Accounting and Financial Planning) at **ACH Electronic CreditGUSTO PAY 123456**: $5,850.00  
  - **January 19:** Loan Payments (Credit Card Payment) at **CREDIT CARD 3333 PAYMENT**: $25.00, Transportation (Taxis and Ride Shares) at **Uber**: $5.40  
  - **January 21:** Loan Payments (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT**: $200.00  
  - **January 23:** Loan Payments (Credit Card Payment) at **BK OF AMER VISA ONLINE PMT**: $150.00  
  - **January 28:** Food and Drink (Fast Food) at **KFC**: $500.00, General Merchandise (Other) at **AUTOMATIC PAYMENT - THANK**: $2,078.50, General Merchandise (Sporting Goods) at **Madison Bicycle Shop**: $500.00  
  - **January 29:** Entertainment (Sporting Events, Amusement Parks, and Museums) at **Tectra Inc**: $500.00  
  
  </details>
  
  <details>
  <summary >Detailed Table</summary>
  
  | Date       | Category       | Merchant                                          | Amount  |
  |------------|----------------|---------------------------------------------------|---------|
  | 2025-01-02 | Insurance      | Prudential                                       | $101.94 |
  | 2025-01-02 | Credit Card Payment | Apple Card                               | $133.57 |
  | 2025-01-02 | Credit Card Payment | Barclays                                 | $6,405.09 |
  | 2025-01-02 | Other Payment  | Small Business Administration                    | $120.00 |
  | 2025-01-13 | Credit Card Payment | Apple Card                               | $5,021.43 |
  | 2025-01-15 | Other          | FUN                                             | $89.40  |
  | 2025-01-16 | Coffee         | Starbucks                                       | $4.33   |
  | 2025-01-16 | Fast Food      | McDonald's                                      | $12.00  |
  | 2025-01-17 | Gyms and Fitness Centers | Touchstone Climbing               | $78.50  |
  | 2025-01-17 | Flights        | United Airlines                                 | $500.00 |
  | 2025-01-18 | Other          | CD DEPOSIT .INITIAL.                           | $1,000.00 |
  | 2025-01-18 | Accounting and Financial Planning | ACH Electronic CreditGUSTO PAY 123456 | $5,850.00 |
  | 2025-01-19 | Credit Card Payment | CREDIT CARD 3333 PAYMENT *//           | $25.00  |
  | 2025-01-19 | Taxis and Ride Shares | Uber                                | $5.40   |
  | 2025-01-21 | Credit Card Payment | BK OF AMER VISA ONLINE PMT           | $200.00 |
  | 2025-01-23 | Credit Card Payment | BK OF AMER VISA ONLINE PMT           | $150.00 |
  | 2025-01-28 | Fast Food      | KFC                                             | $500.00 |
  | 2025-01-28 | Other          | AUTOMATIC PAYMENT - THANK                      | $2,078.50 |
  | 2025-01-28 | Sporting Goods | Madison Bicycle Shop                            | $500.00 |
  | 2025-01-29 | Sporting Events, Amusement Parks, and Museums | Tectra Inc | $500.00 |
  
  </details>
  </div>`;

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => {
      const updatedDropdowns = {
        ...prev,
        [index]: !prev[index],
      };
  
      const container: any = document.querySelector(".details-container");
  
      if (container && container?.style) {
        const anyOpen = Object.values(updatedDropdowns).some((isOpen) => isOpen);
  
        if (window.matchMedia("(min-width: 1024px)").matches) {
          container.style.flexDirection = anyOpen ? "column" : "row";
        } else {
          container.style.flexDirection = "column";
        }
      }
  
      return updatedDropdowns;
    });
  };
  


  const IconStart = () => (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 1.5V5.5M1 3.5H5M4 15.5V19.5M2 17.5H6M11 1.5L13.2857 8.35714L19 10.5L13.2857 12.6429L11 19.5L8.71429 12.6429L3 10.5L8.71429 8.35714L11 1.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderers = {
    details: ({ children, node }: any) => {
      const index = node.position?.start.offset ?? Math.random();
      const isOpen = openDropdowns[index] || false;

      return (
        <div style={{
          maxWidth: isOpen ? "" : "min-content"
        }} className="mt-2 max-w-[calc(100vw-110px)] md:w-[calc(100%-40px)] lg:w-[calc(100%)] lg:max-w-[745px] rounded-lg overflow-hidden">
          {children?.map((child: any) => {
            const isVisualiseBreakdown = `${child?.props?.children}`?.includes("Visualise Breakdown");
            const isTableBreakdown = `${child?.props?.children}`?.includes("Table");
            console.log("summarysummary", isVisualiseBreakdown)

            return child.type === "summary" ? (
              // <button
              //   key={index}
              //   onClick={() => toggleDropdown(index)}
              //   className={cn(
              //     "w-full flex justify-between hover:bg-white hover:bg-opacity-5 duration-300 items-center px-4 py-3 text-lg font-semibold text-white  rounded-lg transition-all", isOpen ? " mb-4" : ""
              //   )}
              // >
              //   <div className="flex items-center gap-4">
              //     <IconStart />
              //     <span>{child.props.children}</span>
              //   </div>
              //   {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              // </button>
              <div style={{ width: isVisualiseBreakdown ? "180px" : "", marginTop: (isTableBreakdown && isOpen) ? "-8px" : "" }}
                onClick={() => {
                  if (isVisualiseBreakdown) {
                    showHideCalculation();
                  } else {
                    toggleDropdown(index)

                  }
                }
                }
                key={index} className=" hover:cursor-pointer text-[#525ED1]">
                {child.props.children}
              </div>
            ) : (
              <div
                key={`${index}-content`}
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                )}
                style={{
                  maxHeight: isOpen ? "10000px" : "0px",
                  overflow: isOpen ? "visible" : "hidden",
                }}
              >
                <div className="px-4 ">
                  <div
                    className="overflow-x-auto mt-3"
                    style={{ maxWidth: "100%" }}
                  >
                    {child}
                  </div>
                </div>
              </div>
            )
          }
          )}
        </div>
      );
    },
    table: ({ children }: any) => (
      <div className="overflow-x-auto w-full">
        <table
          className="w-full border-collapse border border-gray-700"
          style={{ marginBottom: "16px" }}
        >
          {children}
        </table>
      </div>
    ),
    li: ({ children }: any) => {
      const hasIcon = typeof children?.[0] === "object" && children?.[0]?.props?.src;

      return hasIcon ? (
        <li className="flex items-center gap-2 my-2">
          {hasIcon && (
            <img
              src={children[0].props.src}
              alt={children[0].props.alt || ""}
              className="h-5 w-5 mr-2"
            />
          )}
          <span className="flex-1">{hasIcon ? children.slice(1) : children}</span>
        </li>
      ) : (
        <li>{children}</li>
      );
    },
  };

  return (
    <div className={clsx("flex items-start w-full gap-6 max-w-[calc(100%)]", { "bg-[#272E48] rounded-lg p-8 w-fit": isUser })}>
      {!isUser && !isLoading && (
        <div className="flex items-end gap-4 mt-1">
          <span className="w-4 h-4">
            <Icon type="SmallLogo" />
          </span>
          {/* <span className="text-white text-2xl leading-3 font-medium">
            {isLastMessage ? "Answer" : "Finfy"}
          </span> */}
        </div>
      )}

      <p
        className={cn(
          "whitespace-pre-line text-white font-normal text-base leading-5",
          isUser
            ? "flex gap-2.5 items-center"
            : ""
        )}
        style={{ letterSpacing: '-0.3px', lineHeight: '140%' }}
      >
        {isUser || isLoading ? (
          text
        ) : (
          <Markdown
            className={"markdown max-w-[845px] w-full !whitespace-normal markdown-special"}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={renderers}
          >
            {text as string}
          </Markdown>
        )}
      </p>
    </div>
  );
};

export { ContentMessage };
