"use client";

import { Button, Icon } from "@/components/atoms";
import { UserSettings, MenuAccordion } from "@/components/molecules";
import Image from "next/image";
import Link from "next/link";
import { ScrollableArea } from "@/components/molecules";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks";

const Sidebar = () => {
  const { open, handleClose } = useSidebar();
  return (
    <aside
      className={cn(
        "right-sidebar transition-all flex flex-col gap-5 fixed inset-0 z-50 w-full lg:static lg:max-w-64",
        {
          "-translate-x-full lg:translate-x-0": !open,
        }
      )}
    >
      <div className="px-2 flex flex-col">
        <div className="my-5 flex justify-between items-center">
          <Link href="/dashboard">
            <Image
              src="/icons/logo.svg"
              height={100}
              width={100}
              alt="logo"
              className="cursor-pointer"
            />
          </Link>
          <Button onClick={handleClose} variant="ghost">
            <Icon
              className="cursor-pointer hover:text-grey-5"
              type="LogOutIcon"
            />
          </Button>
        </div>
        <Button
          variant="ghost"
          className="flex gap-2 bg-navy-25 group border-purple-15 justify-start px-2 items-center border w-full !rounded-sm"
        >
          <Icon
            type="PlusSolidIcon"
            className="fill-grey-15 group-hover:fill-white w-5 h-5"
          />
          <span className="text-base text-grey-15 group-hover:text-white">
            New Thread
          </span>
        </Button>
      </div>
      <ScrollableArea className="px-2">
        <MenuAccordion />
      </ScrollableArea>
      <div className="mt-auto">
        <Button
          full
          icons={{
            iconLeft: (
              <Icon
                type="DownloadIcon"
                className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
              />
            ),
          }}
          className="justify-start items-center gap-3 p-2 !rounded-none font-normal"
          variant="ghost"
        >
          Download
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
          className="justify-start items-center gap-3 p-2 !rounded-none font-normal"
          variant="ghost"
        >
          More
        </Button>
        <Button
          full
          className="justify-start items-center text-xs font-semibold border-t border-t-navy-5 text-white p-6 !rounded-none"
          variant="ghost"
        >
          Business Profile
        </Button>
        <div className="menu-button-btn flex space-x-2 items-center">
          <UserSettings />
          <Icon type="GearIcon" />
        </div>
        <div className="menu-button-btn">
          <Button full className="!rounded-sm gap-1.5 h-7">
            <Icon type="ExtLinkIcon" className="size-4 text-grey-15" />
            Try pro
          </Button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
