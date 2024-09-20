import { FC } from "react";

interface ButtonProps {
  Icon: JSX.Element;
  text: string;
}

const ActionButton: FC<ButtonProps> = ({ Icon, text }) => {
  return (
    <span className="home-assist-btn group gap-1 items-center flex text-sm text-normal py-0.5 px-1.5">
      {Icon}
      {text}
    </span>
  );
};

export { ActionButton };
