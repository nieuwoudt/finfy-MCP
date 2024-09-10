import type {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

export type TypeTagButton = "a" | "button";

type CommonProps = {
  variant?: Color;
  full?: boolean;
  size?: Size;
  icons?: {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };
};

type LinkComponentProps = CommonProps &
  (AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "link";
    href: string;
    disabled?: boolean;
  });

type ButtonComponentProps = CommonProps &
  (ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  });

export type ButtonProps = ButtonComponentProps | LinkComponentProps;

export type Color = "default" | "outline" | "plain";
export type Size = "xs" | "sm" | "base" | "lg" | "xl";
