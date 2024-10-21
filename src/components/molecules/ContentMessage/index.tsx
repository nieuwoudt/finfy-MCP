"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
  const [isTableVisible, setIsTableVisible] = useState(false); // State to handle table visibility
  const [hasTable, setHasTable] = useState(false); // State to track if there's a table in the content

  if (!text) {
    return null;
  }

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible); // Toggle the table visibility
  };

  const IconStart = () => <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 1.5V5.5M1 3.5H5M4 15.5V19.5M2 17.5H6M11 1.5L13.2857 8.35714L19 10.5L13.2857 12.6429L11 19.5L8.71429 12.6429L3 10.5L8.71429 8.35714L11 1.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>


  const transformMarkdownContent = (text: string) => {
    return text.replace(/\(([^)]+)\)\((https?:\/\/[^\s]+)\)/g, "![$1]($2)");
  };

  // Transform the content if it's a string
  const transformedText =
    typeof text === "string" ? transformMarkdownContent(text) : text;

  // Custom Markdown component to hide or show table elements based on `isTableVisible` state
  // const renderers = {
  //   table: ({ children }: any) => {
  //     if (!hasTable) setHasTable(true); // Set hasTable to true when a table is detected

  //     return (
  //       <>
  //         {hasTable && (
  //           <div>
  //             <button
  //               className="flex border-[#374061] border-2 px-3 min-h-[61px] text-[24px] py-4 font-semibold !rounded-lg hover:bg-opacity-5 transition-all duration-200 text-base text-white justify-between bg-purple-15 bg-opacity-0 w-full"
  //               onClick={toggleTableVisibility}
  //             >
  //               <div className="flex gap-4">
  //                 <IconStart />
  //                 <span>{isTableVisible ? "Hide detailed breakdown" : "Detailed breakdown"}</span>
  //               </div>
  //               {isTableVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
  //             </button>
  //           </div>
  //         )}
  //         <div
  //           className={cn(
  //             "transition-all duration-500 ease-in-out",
  //             isTableVisible ? "opacity-100 overflow-auto" : "opacity-0 overflow-hidden"
  //           )}
  //           style={{ maxHeight: isTableVisible ? '10000px' : '0px', transition: 'max-height 0.5s ease, opacity 0.5s ease' }}
  //         >
  //           <table style={{ maxHeight: isTableVisible ? '10000px' : '0px', transition: 'max-height 0.5s ease, opacity 0.5s ease' }}
  //             className="table-auto rounded-md w-full text-white border-collapse border border-gray-600 mt-4">
  //             {children}
  //           </table>
  //         </div>
  //       </>
  //     );
  //   },
  //   // li: ({ children }: any) => {
  //   //   const firstChild = children[0];
  //   //   const hasImage = firstChild?.props?.node?.tagName === "img"; // Check if the first child is an image
    
  //   //   return (
  //   //     <li className={cn("", hasImage ? "flex" : "flex")}> {/* Disable the default bullet point */}
  //   //       {hasImage && (
  //   //         <img
  //   //           src={firstChild.props.src}
  //   //           alt={firstChild.props.alt}
  //   //           className="inline-block w-6 h-6 mr-2 align-middle"
  //   //         />
  //   //       )}
  //   //       {children.slice(hasImage ? 1 : 0)} {/* Render the rest of the list item after the image */}
  //   //     </li>
  //   //   );
  //   // }

  // };

  const renderers = {
    details: ({ children }: any) => (
      <div>
        <button
          className="flex border-[#374061] mt-4 border-2 px-3 min-h-[61px] text-[24px] py-4 font-semibold !rounded-lg hover:bg-opacity-5 transition-all duration-200 text-base text-white justify-between bg-purple-15 bg-opacity-0 w-full"
          onClick={toggleTableVisibility}
        >
          <div className="flex gap-4">
            <IconStart />
            <span>
              {isTableVisible ? "Hide detailed breakdown" : "Detailed breakdown"}
            </span>
          </div>
          {isTableVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>

        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            isTableVisible ? "opacity-100 overflow-auto" : "opacity-0 overflow-hidden"
          )}
          style={{
            maxHeight: isTableVisible ? "10000px" : "0px",
            transition: "max-height 0.5s ease, opacity 0.5s ease",
          }}
        >
          <div className="mt-4">{children}</div>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex flex-col h-full">
      {!isUser && !isLoading && (
        <div className="flex items-end gap-4 mb-4">
          <span className="w-4 h-4">
            <Icon type="SmallLogo" />
          </span>
          <span className="text-white text-2xl leading-3 font-medium">
            {isLastMessage ? "Answer" : "Finfy"}
          </span>
        </div>
      )}

      {/* Render the rest of the Markdown content (excluding the table) */}
      <p
        className={cn(
          "whitespace-pre-line text-white font-normal leading-[14px] md:leading-8",
          isUser
            ? "text-2xl md:text-4xl font-bold flex gap-2.5 items-center"
            : "text-sm md:text-base"
        )}
      >
        {isUser || isLoading ? (
          text
        ) : (
          <Markdown
            className={"markdown !whitespace-normal markdown-special"}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={renderers} // Custom renderers for table elements
          >
            {transformedText as string}
          </Markdown>
        )}
      </p>
      {/* Button to toggle table visibility, placed right above the table */}
    </div>
  );
};

export { ContentMessage };
