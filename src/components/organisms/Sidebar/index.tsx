"use client";

import { Button, Icon } from "@/components/atoms";
import {
  UserSettings,
  MenuAccordion,
  SubscribePop,
} from "@/components/molecules";
import Image from "next/image";
import Link from "next/link";
import { ScrollableArea } from "@/components/molecules";
import { cn } from "@/lib/utils";
import { useChat, useSidebar } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateNewChatPop } from "../CreateNewChatPop";

const Sidebar = () => {
  const router = useRouter();
  const { handleResetChat } = useChat();
  const { open, handleToggle } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    handleResetChat();
    router.push("/dashboard");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <aside
      className={cn(
        "right-sidebar transition-all flex flex-col gap-5 fixed inset-0 z-50 w-full lg:sticky lg:max-w-64",
        open
          ? "translate-x-0 w-[calc(100%-38px)] lg:w-full"
          : "-translate-x-full lg:translate-x-0 lg:max-w-14"
      )}
    >
      <div className="px-2 flex flex-col">
        <div
          className={cn("my-5 flex justify-between items-center", {
            "lg:flex-col-reverse lg:gap-2": !open,
          })}
        >
          <button onClick={handleClick}>
            {open ? (
              <Image
                src="/icons/full-logo.svg"
                height={100}
                width={100}
                alt="logo"
                className="cursor-pointer"
              />
            ) : (
              <Icon type="LogoIcon" />
            )}
          </button>
          <Button onClick={handleToggle} variant="ghost">
            <Icon
              type={"ToggleSidebarIcon"}
              className={cn({ "rotate-180": !open })}
            />
          </Button>
        </div>
        <CreateNewChatPop>
          <Button
            variant="ghost"
            className="flex gap-2 bg-navy-25 group text-nowrap border-purple-15 justify-start px-2 items-center border w-full !rounded-sm"
          >
            <Icon
              type="PlusSolidIcon"
              className="fill-grey-15 group-hover:fill-white w-5 h-5"
            />

            <span
              className={cn("text-base text-grey-15 group-hover:text-white", {
                "lg:hidden": !open,
              })}
            >
              New Thread
            </span>
          </Button>
        </CreateNewChatPop>
      </div>
      <ScrollableArea className="px-2">
        <MenuAccordion />
      </ScrollableArea>
      <div className="mt-auto">
        {/* <Button
          full
          icons={{
            iconLeft: (
              <Icon
                type="DownloadIcon"
                className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
              />
            ),
          }}
          className={cn(
            "justify-start items-center gap-3 p-2 !rounded-none font-normal",
            {
              "lg:justify-center": !open,
            }
          )}
          variant="ghost"
        >
          <span className={cn({ "lg:hidden": !open })}>Download</span>
        </Button>
        <Button
          full
          icons={{
            iconLeft: (
              <Icon
                type="DotsIcon"
                className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
              />
            ),
          }}
          className={cn(
            "justify-start items-center gap-3 p-2 !rounded-none font-normal",
            {
              "lg:justify-center": !open,
            }
          )}
          variant="ghost"
        >
          <span className={cn({ "lg:hidden": !open })}>More</span>
        </Button> */}
        {/* <Button
          full
          className={cn(
            "justify-start items-center text-xs font-semibold border-t border-t-navy-5 text-white p-6 !rounded-none",
            {
              "lg:hidden": !open,
            }
          )}
          variant="ghost"
        >
          Business Profile
        </Button> */}
        <UserSettings />
        <div
          className={cn("menu-button-btn", {
            "lg:!p-2": !open,
          })}
        >
          {/* <SubscribePop>
            <Button full className="!rounded-sm gap-1.5 h-7 p-0 text-nowrap">
              <Icon type="ExtLinkIcon" className="size-4 text-grey-15" />
              <span className={cn({ "lg:hidden": !open })}>Try pro</span>
            </Button>
          </SubscribePop> */}
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
