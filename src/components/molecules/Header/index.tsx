"use client";

import { Button, Icon, Loader } from "@/components/atoms";
import { useChat, useSidebar, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { FocusAssistantPopover } from "../Popovers";
import { ActionButton } from "../ActionButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatar } from "../UserAvatar";

export const HeaderFocus = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 20);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!shouldRender) {
    return <div className="w-screen h-screen top-0 flex items-center justify-center bottom-0 left-0 right-0 backdrop-blur-3xl !z-[1000] absolute"><Loader /></div>
  }

  return (<div className="w-full flex items-center z-[500] pr-2.5 justify-between" style={{
    zIndex: 200
  }}>
    {true &&
      (<>
        <FocusAssistantPopover >
          <ActionButton
            onClick={() => { }}
            className={cn("h-10 p-2 !z-[500] !text-[#9CA3AF] group rounded-[40px] justify-start items-center gap-3 text-base font-semibold leading-normal inline-flex",
            )}
            Icon={
              <Icon
                type="SearchIcon"
                className={cn(" h-3.5 w-5 !text-[#515AD9] fill-[#515AD9]")}
              />
            }
            text={"Focus"}
            SecondIcon={<Icon
              type="ChrIcon"
              className={cn("group-hover:stroke-[#f3f9ed] transition-all duration-200 h-3.5 w-5", 0 ? "stroke-[#f3f9ed] -rotate-180 -translate-x-1" : "stroke-[#547A91]")}
            />}
          />
        </FocusAssistantPopover>
      </>)
    }
    <UserAvatar src={user?.avatar_url}
      className={cn(
        " lg:flex justify-center items-center !border-none !z-50 w-[42px] h-[42px] rounded-full !ml-0 "

      )}
    />
  </div>)
}

const Header = () => {
  const { handleToggle, open } = useSidebar();
  const [isDashboard, setIsDashboard] = useState(false);
  const pathname = usePathname();
  const { messages } = useChat();


  useEffect(() => {
    setIsDashboard("/dashboard" === pathname && !messages?.length)
  }, [pathname, messages])

  return (
    <header className="fixed top-0 flex flex-row justify-between items-center left-0 p-3.5 w-full bg-navy-25 lg:hidden">
      <Button onClick={handleToggle} variant="ghost">
        <Icon
          type={"ToggleSidebarIcon"}
          className={cn({ "rotate-180": !open })}
        />
      </Button>
      {isDashboard && <div className="lg:hidden flex flex-col w-full items-center justify-center">
        <FocusAssistantPopover
        >
          <ActionButton
            Icon={
              <Icon
                type="SearchIcon"
                className="fill-purple-15 text-white group-hover:fill-white h-3.5 w-5"
              />
            }
            text={"Focus"}
            className="text-white flex flex-row items-center justify-center gap-1 text-sm"
          />
        </FocusAssistantPopover>
      </div>}
      <div className="w-6 h-6 px-2.5 py-1.5" />
    </header>
  );
};

export { Header };
