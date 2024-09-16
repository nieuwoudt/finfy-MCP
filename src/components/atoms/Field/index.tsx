import { Label } from "@/components/atoms";
import cx from "clsx";
import { FC, forwardRef } from "react";

import { FieldProps } from "./index.types";

const Field: FC<FieldProps> = forwardRef(
  ({
    classes,
    label,
    helperText,
    id,
    full,
    isRequired,
    sideElements = {},
    ...props
  }, ref) => {
    const { left, right } = sideElements;
    return (
      <div className={cx(classes?.wrapper, full ? "w-full" : "w-fit")}>
        <div
          className={cx(
            "flex flex-col w-auto gap-2 relative",
            full ? "w-full" : "w-fit",
            classes?.container
          )}
        >
          {label && (
            <Label
              isRequired={isRequired}
              className={cx(classes?.label, {
                "!text-accent-content": Boolean(helperText),
              })}
              htmlFor={id}
            >
              {label}
            </Label>
          )}
          <div
            className={cx(
              "rounded-lg overflow-hidden px-3 py-2 text-base font-medium bg-navy-15 border flex items-center shadow-sm border-deep-slate",
              classes?.containerInput,
              full ? "w-full" : "w-fit",
              { "border-accent-content": helperText }
            )}
          >
            {left}
            <input
              id={id}
              {...props}
              ref={ref}
              className={cx(
                "text-white outline-none bg-transparent h-full w-full placeholder:text-base placeholder:font-light",
                props?.className
              )}
            />
            {right}
          </div>
          {helperText && (
            <span
              className={cx(
                "text-accent-content text-xs font-light absolute top-full",
                classes?.helperText
              )}
            >
              {helperText}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Field.displayName = "Field";
export { Field };
