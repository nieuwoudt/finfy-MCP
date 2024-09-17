"use client";

import { Label, Icon, Button } from "@/components/atoms";
import cx from "clsx";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { OptionsType } from "@/types";

import { AutocompleteProps } from "./index.types";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const Autocomplete: FC<AutocompleteProps> = ({
  classes,
  label,
  helperText,
  id,
  full,
  isRequired,
  sideElements = {},
  options,
  handleOptionClick,
  onChange,
  isLoading,
  currentValue,
  setCurrentValue,
  defaultValue,
  ...props
}) => {
  const [currentOptions, setCurrentOptions] = useState<OptionsType[] | null>(
    options || null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isRenderTop, setIsRenderTop] = useState(false);
  const [value, setValue] = useState("");
  const selectedCurrency = searchParams.get("currency");
  const [selectOption, setSelectOption] = useState<OptionsType | null>(
    defaultValue || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const { left, right } = sideElements;

  const handleOpenList = () => {
    setIsOpen(true);
  };

  const handleCloseList = () => {
    setIsOpen(false);
  };

  const handleCloseOnBlur = () => {
    handleCloseList();
    const hasOption = options.some((option) => option.label === value);
    if (!hasOption) {
      setValue("");
    }
  };

  const handleClick = (option: OptionsType) => {
    if (handleOptionClick) {
      handleOptionClick(option);
    }
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", option.value);
    router.push(`${pathname}?${params.toString()}`, undefined);
    setSelectOption(option);
    handleCloseList();
  };

  const filterOptions = (value: string) => {
    const newOptions = options.filter((item) =>
      item.value.toLowerCase().includes(value.toLowerCase())
    );
    setCurrentOptions(newOptions);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    filterOptions(value);
    setCurrentValue && setCurrentValue(value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleResetValue = () => {
    setValue("");
    setCurrentValue && setCurrentValue("");
    handleCloseList();
  };

  const updatePosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const neededSpace = 250;

    setIsRenderTop(spaceBelow < neededSpace);
  };

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, []);
  useEffect(() => {
    setValue(currentValue || "");
  }, [currentValue]);

  useEffect(() => {
    if (defaultValue?.value) {
      setSelectOption({ ...defaultValue });
    }
  }, [defaultValue?.value]);

  useEffect(() => {
    if (options.length) {
      setCurrentOptions(options);
    }
  }, [options]);

  useEffect(() => {
    if (selectedCurrency) {
      const selectedOption = options.find(
        (option) => option.value === selectedCurrency
      );
      if (selectedOption) {
        setSelectOption(selectedOption);
      }
    }
  }, [options]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed h-full w-full inset-0 z-10"
          onClick={handleCloseOnBlur}
        ></div>
      )}
      <div
        onClick={(event) => event.stopPropagation()}
        ref={wrapperRef}
        className={cx(
          "relative ",
          classes?.wrapper,
          full ? "w-full" : "w-fit",
          { "z-20": isOpen }
        )}
      >
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
              "rounded-md bg-navy-25 border border-navy-5 py-2 relative flex items-center focus:shadow-lg border-secondary px-3",
              classes?.containerInput,
              full ? "w-full" : "w-fit",
              { "!border-accent-content": helperText }
            )}
          >
            {left}
            {selectOption?.value && !isOpen && (
              <div className="bg-transparent text-sm font-medium text-white absolute top-1/2 -translate-y-1/2">
                {selectOption.label}
              </div>
            )}
            <input
              id={id}
              {...props}
              value={value}
              onChange={handleChange}
              onFocus={handleOpenList}
              className={cx(
                "text-white bg-transparent outline-none z-10 text-sm font-medium h-full w-full placeholder:text-sm placeholder:font-medium",
                { "placeholder:text-transparent": selectOption?.value },
                props?.className
              )}
            />
            {isOpen && (
              <ul
                className={cx(
                  "absolute max-h-60 left-0 z-10 w-full bg-navy-25 border-navy-5 overflow-auto my-1 rounded-md border border-secondary shadow",
                  isRenderTop ? "bottom-full" : "top-full",
                  classes?.list
                )}
              >
                {isLoading ? (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </li>
                ) : currentOptions?.length ? (
                  currentOptions?.map((option) => {
                    return (
                      <li
                        key={option.value}
                        onClick={() => handleClick(option)}
                        className="px-4 pl-10 py-2 flex gap-1 relative items-center text-white text-sm font-medium hover:bg-navy-15 cursor-pointer"
                      >
                        {selectOption?.value === option.value && (
                          <Icon
                            type="CheckSelectedIcon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 fill-grey-25"
                          />
                        )}

                        {option.label}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-2 text-white hover:bg-gray-100 cursor-pointer">
                    Nothing found
                  </li>
                )}
              </ul>
            )}
            {value && (
              <Button
                className="w-5 h-5 p-0"
                variant="ghost"
                onClick={handleResetValue}
              >
                <Icon type="CloseIcon" className={"w-5 h-5 stroke-white"} />
              </Button>
            )}
            {right ? right : <Icon type="ChevronUpDownIcon" />}
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
    </>
  );
};

export { Autocomplete };
