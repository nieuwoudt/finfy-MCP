import type { ComponentProps, ReactNode } from "react";

import { Classes, OptionsType } from "@/types";

export type AutocompleteProps = Omit<
  ComponentProps<"input">,
  "defaultValue"
> & {
  options: OptionsType[];
  selectOption?: OptionsType;
  handleOptionClick?: (option: OptionsType) => void;
  id?: string;
  placeholder?: string;
  classes?: Classes & {
    label?: string;
    helperText?: string;
    containerInput?: string;
    list?: string;
  };
  label?: string | ReactNode;
  isLoading?: boolean;
  helperText?: string | boolean;
  isRequired?: boolean;
  full?: boolean;
  sideElements?: {
    right?: ReactNode;
    left?: ReactNode;
  };
  defaultValue?: OptionsType;
  currentValue?: string;
  setCurrentValue?: (value: string) => void;
};
