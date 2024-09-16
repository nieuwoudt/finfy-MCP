import { ScrollArea } from "@/components/atoms";
import { FC, PropsWithChildren } from "react";

interface ScrollableAreaProps extends PropsWithChildren {
  className?: string;
}
const ScrollableArea: FC<ScrollableAreaProps> = ({ className, children }) => {
  return <ScrollArea className={className}>{children}</ScrollArea>;
};

export { ScrollableArea };
