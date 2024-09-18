"use client";
import { Button, Icon } from "@/components/atoms";
import { useSidebar } from "@/hooks";

const Header = () => {
  const { open, handleOpen } = useSidebar();
  return (
    <header className="fixed top-0 left-0 p-3.5 w-full bg-navy-25 block lg:hidden">
      {!open && (
        <Button
          onClick={handleOpen}
          variant="ghost"
          className="p-3"
        >
          <span className="relative flex flex-col justify-between min-w-5 h-4 after:block after:absolute after:w-full after:h-0.5 after:bg-grey-15 after:rounded-xl after:bottom-0 before:block before:absolute before:w-full before:h-0.5 before:bg-grey-15 before:rounded-xl before:top-1/2 before:-translate-y-1/2">
            <span className="top-0 bottom-0 w-full h-0.5 rounded-xl bg-grey-15 left-0 right-0"></span>
          </span>
        </Button>
      )}
    </header>
  );
};

export { Header };
