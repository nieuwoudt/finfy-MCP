import { Button, Icon } from "@/components/atoms";
import { UserSettings, MenuAccordion } from "@/components/molecules";
import Image from "next/image";
import Link from "next/link";
import { ScrollableArea } from "@/components/molecules";

const Sidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="p-4 flex flex-col">
        <div className="my-5 flex justify-between items-center">
          <Link href="/">
            <Image
              src="/icons/logo.svg"
              height={100}
              width={100}
              alt="logo"
              className="cursor-pointer"
            />
          </Link>
          <Icon
            className="size-6 -rotate-90 cursor-pointer hover:text-grey-5"
            type="LogOutIcon"
          />
        </div>
        <Button
          variant="ghost"
          className="flex bg-navy-25 border-purple-15 justify-start px-2 items-center border w-full"
        >
          <Icon type="PlusSolidIcon" className="size-5 mr-1" />
          <span className="text-base">New Thread</span>
        </Button>
      </div>
      <ScrollableArea className="w-[256px] px-2">
        <MenuAccordion />
      </ScrollableArea>
      <div className="mt-auto">
        <div className="menu-button-btn cursor-pointer hover:text-grey-5">
          Business profile
        </div>
        <div className="menu-button-btn flex space-x-2 items-center">
          <UserSettings />
          <Icon type="GearIcon" />
        </div>
        <div className="menu-button-btn">
          <Button className="rounded-sm gap-1 w-[224px] h-7">
            <Icon type="ExtLinkIcon" className="size-4 text-grey-15" />
            Try pro
          </Button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
