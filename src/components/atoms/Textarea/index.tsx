import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        onInput={(event) => {
          const target = event.target as HTMLTextAreaElement;
          target.style.height = "28px";
          const maxHeight = 200;
          target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
        }}
        className={cn(
          "flex w-full rounded-full items-center justify-center h-auto border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          padding: "auto"
        }}
        autoFocus={false}
        ref={ref}
        {...props}
      />

    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
