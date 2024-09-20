import { FC } from "react";

interface FocusAssistantOptionProps {
  title: string;
  text: string;
}

const FocusAssistantOption: FC<FocusAssistantOptionProps> = ({
  title,
  text,
}) => {
  return (
    <button className="flex flex-col gap-2 items-start hover:bg-navy-5 p-2 rounded-md">
      <h3 className="text-white font-semibold text-sm text-start">{title}</h3>
      <p className="text-grey-5 font-medium text-xs text-start">{text}</p>
    </button>
  );
};

export { FocusAssistantOption };
