"use client";

import { Button, Icon } from "@/components/atoms";
import { useSidebar } from "@/hooks";
import { cn } from "@/lib/utils";

const Header = () => {
  const { handleToggle, open } = useSidebar();
  return (
    <header className="fixed top-0 left-0 p-3.5 w-full bg-navy-25 block lg:hidden">
      <Button onClick={handleToggle} variant="ghost">
        <Icon
          type={"ToggleSidebarIcon"}
          className={cn({ "rotate-180": !open })}
        />
      </Button>
    </header>
  );
};

export { Header };
