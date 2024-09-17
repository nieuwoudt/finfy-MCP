"use client";
import { Button, Icon } from "@/components/atoms";
import { useSidebar } from "@/hooks";

const Header = () => {
  const { open, handleOpen } = useSidebar();
  return (
    <header className="fixed top-0 left-0 p-3.5 w-full bg-navy-25 block lg:hidden">
      {!open && (
        <Button onClick={handleOpen} variant="ghost" className="">
          <Icon
            className="cursor-pointer hover:text-grey-5 rotate-180"
            type="LogOutIcon"
          />
        </Button>
      )}
    </header>
  );
};

export { Header };
