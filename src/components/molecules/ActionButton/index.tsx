"use client";

import { ComponentProps, FC } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  Icon: JSX.Element;
  SecondIcon?: JSX.Element;
  text: string;
}

const ActionButton: FC<ButtonProps> = ({ Icon, text, SecondIcon, ...props }) => {
  return (
    <button
      className="home-assist-btn group gap-1 items-center flex text-sm text-normal py-0.5 px-1.5"
      {...props}
    >
      {Icon}
      {text}
      {SecondIcon}
    </button>
  );
};

export { ActionButton };
