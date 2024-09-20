"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const PopoverRoot = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn("cursor-pointer", className)}
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn("absolute right-2 top-2", className)}
    {...props}
  />
));
PopoverClose.displayName = PopoverPrimitive.Close.displayName;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPortal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 pt-2 px-5 pb-6 bg-navy-15  border-navy-5 rounded-md",
        "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out",
        className
      )}
      {...props}
    >
      {children}
      <PopoverClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100">
        <span className="sr-only">Close</span>
      </PopoverClose>
    </PopoverPrimitive.Content>
  </PopoverPortal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("font-medium text-xs text-grey-15 pb-2 border-b border-b-navy-5", className)} {...props} />
);
PopoverHeader.displayName = "PopoverHeader";

const PopoverFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-4 flex justify-end space-x-2", className)}
    {...props}
  />
);
PopoverFooter.displayName = "PopoverFooter";

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Close: PopoverClose,
  Content: PopoverContent,
  Header: PopoverHeader,
  Footer: PopoverFooter,
});

export { Popover };
