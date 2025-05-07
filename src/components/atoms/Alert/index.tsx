import React from "react";
import { cn } from "@/utils/cn";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning";
}

export function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        {
          "bg-gray-50 text-gray-900 border-gray-200": variant === "default",
          "bg-red-50 text-red-900 border-red-200": variant === "destructive",
          "bg-yellow-50 text-yellow-900 border-yellow-200": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
} 