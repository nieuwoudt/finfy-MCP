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
}

const ContentMessage: FC<ContentMessageProps> = ({
  text,
  isUser,
  isLoading,
  isLastMessage,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});

  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
        <div className="my-4 max-w-[calc(100vw-110px)] md:w-[calc(100%-40px)] lg:w-[calc(100%)] lg:max-w-[745px] rounded-lg overflow-hidden">
          {children?.map((child: any) =>
            child.type === "summary" ? (
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
              <div onClick={() => toggleDropdown(index)} key={index} className=" hover:cursor-pointer text-[#525ED1]">{child.props.children}</div>
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
                <div className="px-4 pt-4">
                  <div
                    className="overflow-x-auto"
                    style={{ maxWidth: "100%" }}
                  >
                    {child}
                  </div>
                </div>
              </div>
            )
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
    <div className={clsx("flex items-start w-full gap-6 max-w-[100%]", {"bg-[#272E48] rounded-lg p-8 w-fit": isUser})}>
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
