"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { FC } from "react";
import { setSuggest } from "@/lib/store/features/suggest/suggestSlice";
interface FocusAssistantOptionProps {
  title: string;
  text: string;
  suggest: any;
}

const FocusAssistantOption: FC<FocusAssistantOptionProps> = ({
  title,
  text,
  suggest,
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setSuggest(suggest));
  };
  return (
    <button
      onClick={handleClick}
      className="flex flex-col gap-2 items-start hover:bg-navy-5 p-2 rounded-md"
    >
      <h3 className="text-white font-semibold text-sm text-start">{title}</h3>
      <p className="text-grey-5 font-medium text-xs text-start">{text}</p>
    </button>
  );
};

export { FocusAssistantOption };
