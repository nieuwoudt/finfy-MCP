"use client";

import { Button, Icon } from "@/components/atoms";
import { useChat, useSidebar } from "@/hooks";
import { cn } from "@/lib/utils";
import { FocusAssistantPopover } from "../Popovers";
import { ActionButton } from "../ActionButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
