"use client";
import { Icon } from "@/components/atoms";
import { useCategory, useUser } from "@/hooks";
import { usePathname } from "next/navigation";
import { FocusAssistantPopover } from "../Popovers";
import { ActionButton } from "../ActionButton";
import { useMemo } from "react";

const HeaderText = () => {
  const { user } = useUser();
  const { category } = useCategory();
  const pathname = usePathname();
  const firstName = "Nieve";

  const headerText = {
    assistant: {
      title: (
        <>
          <span className="text-purple-15">Hey {user?.name}!</span> I&apos;m
          your financial assistant.
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    payments: {
      title: (
        <>
          Lets narrow our focus to your
          <span className="text-purple-15">&nbsp;spending</span>.
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    advisors: {
      title: (
        <>
          Lets narrow our focus to your
          <span className="text-purple-15">&nbsp;spending</span>.
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    discover: {
      title: (
        <>
          {firstName}, let&apos;s John, set some
          <span className="text-purple-15">&nbsp;goals</span>.
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Tell me about your financial goals to get started.
        </p>
      ),
    },
    goals: {
      title: (
        <>
          {firstName}, let&apos;s see how you are
          <span className="text-purple-15">&nbsp;tracking</span> on your goals.
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Tell me about your financial goals to get started.
        </p>
      ),
    },
    budget: {
      title: (
        <>
          {user?.name}, let’s set some 
          <span className="text-purple-15">&nbsp;budgets</span>
          .
        </>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Tell me about your financial goals to get started.
        </p>
      ),
    },
  };

  const content = useMemo(() => {
    if (pathname.includes("payments")) {
      return headerText.payments;
    } else if (pathname.includes("discover")) {
      return headerText.discover;
    } else if (pathname.includes("advisors")) {
      return headerText.advisors;
    } else if (pathname.includes("goals")) {
      return headerText.goals;
    } else {
      if (category) {
        return headerText[category as keyof typeof headerText];
      } else {
        return headerText.assistant
      }
    }
  },[category])  

  return (
    <div>
      <div className="flex flex-col w-full pt-20 lg:pt-0 items-center justify-center pb-5 lg:pb-10">
        {content && (
          <>
            <h1 className="header text-center">{content.title}</h1>
            {/* {content.cta} */}
          </>
        )}
      </div>
      <div className="lg:hidden flex flex-col h-[calc(100vh-150px)] opacity-35 w-full items-center justify-center pb-5 lg:pb-10">
        <Icon type="LogoIcon" />
      </div>
    </div>

  );
};

export { HeaderText };
