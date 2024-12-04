import clsx from "clsx";
import { Ref, forwardRef } from "react";

import Link from "next/link";

import {
  sizeClassesWithText,
  sizeClassesWithIconOnly,
  variantClasses,
} from "./index.constants";
import type { ButtonProps } from "./index.types";
import { cn } from "@/lib/utils";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = "default",
      className,
      full = false,
      icons,
      size = "base",
      ...props
    },
    ref
  ) => {
    const IconLeft = icons?.iconLeft;
    const IconRight = icons?.iconRight;

    const isIconOnly = (IconLeft || IconRight) && !children;

    const commonClassName = cn(
      "flex justify-center group items-center cursor-pointer transition-all rounded-full text-center font-semibold text-base",
      full ? "w-full" : "w-fit",
      variantClasses[variant],
      isIconOnly ? sizeClassesWithIconOnly[size] : sizeClassesWithText[size],
      className
    );
    if (props.as === "link") {
      const { as, disabled, ...rest } = props;
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          className={cn(commonClassName, {
            "pointer-events-none": Boolean(disabled),
          })}
          {...rest}
          scroll={false}
        >
          {IconLeft && IconLeft}
          {children}
          {IconRight && IconRight}
        </Link>
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={cn(commonClassName)}
        {...props}
      >
        {IconLeft && IconLeft}
        {children}
        {IconRight && IconRight}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
