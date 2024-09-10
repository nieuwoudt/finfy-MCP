import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface RootMainProps extends PropsWithChildren {
  className?: string;
}

const RootMain: FC<RootMainProps> = ({ children, className }) => {
  return <main className={clsx("min-h-screen", className)}>{children}</main>;
};

export { RootMain };
