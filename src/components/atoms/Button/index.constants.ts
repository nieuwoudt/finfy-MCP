import type { Color, Size } from "./index.types";

const variantClasses: Record<Color, string> = {
  default:
    "text-white fill-white focus:fill-cool-gray bg-primary border border-primary shadow-primary hover:border-primary-hover hover:bg-primary-hover hover:shadow-primary-hover focus:bg-primary-focus focus:border-neutral-dark focus:!shadow-primary-focus disabled:fill-cool-gray disabled:bg-primary-disabled disabled:border-primary-disabled",
  outline:
    "text-black bg-white border border-primary-base md:hover:bg-black hover:border-black md:hover:text-white active:bg-primary-base active:border-primary-base",
  plain: "bg-transparent text-white",
};

const sizeClassesWithText: Record<Size, string> = {
  xs: "py-1 px-2",
  sm: "py-1 px-2",
  base: "py-1.5 px-2.5",
  lg: "py-2 px-3",
  xl: "py-2 px-4",
};

const sizeClassesWithIconOnly: Record<Size, string> = {
  xs: "p-1",
  sm: "p-1.5",
  base: "p-2",
  lg: "p-2.5",
  xl: "p-3",
};

export { variantClasses, sizeClassesWithText, sizeClassesWithIconOnly };
