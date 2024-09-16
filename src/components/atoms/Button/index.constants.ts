import type { Color, Size } from "./index.types";

const variantClasses: Record<Color, string> = {
  default: "bg-purple-15 text-white shadow hover:bg-purple-5",
  destructive: "text-purple-15 bg-purple-15 bg-opacity-10 hover:bg-opacity-30",
  outline:
    "border border-input bg-background shadow-sm hover:bg-navy-15 hover:text-navy-15-foreground",
  secondary: "bg-secondary text-white shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-navy-5 text-white",
  link: "text-white underline-offset-4 hover:underline",
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
