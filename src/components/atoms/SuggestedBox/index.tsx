import { Icon } from "@/components/atoms";
import { FC } from "react";

interface SuggestBoxProps {
  label: string;
  content: string;
  icon: string;
}

const SuggestedBox: FC<SuggestBoxProps> = ({ content, label, icon }) => {
  return (
    <div className="suggest-box">
      <p className="text-white mb-1">
        {icon} {label}
      </p>
      <div className="relative text-grey-15">
        <p className="line-clamp-2 overflow-hidden text-ellipsis max-h-12 pr-6">
          {content}
        </p>
        {/* <Icon
          type={"UpArrowIcon"}
          className="size-3 rotate-45 absolute bottom-0 right-0"
        /> */}
      </div>
    </div>
  );
};

export { SuggestedBox };
