"use client";

import { Button } from "@/components/atoms";
import { useSidebar } from "@/hooks";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const BurgerButton = () => {
  const { open, handleToggle } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Button onClick={handleToggle} variant="ghost" className="p-3 block">
      <span
        className={cn(
          "relative flex flex-col justify-between min-w-5 h-4 after:block after:absolute after:w-full after:h-0.5 after:bg-grey-15 after:rounded-xl after:bottom-0 before:block before:absolute before:w-full before:h-0.5 before:bg-grey-15 before:rounded-xl before:top-1/2 before:-translate-y-1/2",
          open
            ? "after:-translate-y-1/2 after:top-1/2 after:rotate-45 before:-rotate-45"
            : ""
        )}
      >
        {!open && (
          <span className="top-0 bottom-0 w-full h-0.5 rounded-xl bg-grey-15 left-0 right-0"></span>
        )}
      </span>
    </Button>
  );
};

export { BurgerButton };
