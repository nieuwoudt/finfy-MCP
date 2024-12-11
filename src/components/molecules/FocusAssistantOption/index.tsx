"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { FC, ReactNode } from "react";
import { setSuggest } from "@/lib/store/features/suggest/suggestSlice";
interface FocusAssistantOptionProps {
  title: string;
  text: string;
  suggest: any;
  icon: ReactNode;
}

const FocusAssistantOption: FC<FocusAssistantOptionProps> = ({
  title,
  text,
  suggest,
  icon
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setSuggest([]));
    setTimeout(() => {
      dispatch(setSuggest(suggest.slice(0, 6)));
    }, 0);
  };
  return (
    <button
      onClick={handleClick}
      className="flex flex-col gap-2 items-start hover:bg-navy-5 p-2 rounded-md"
    >
     
      <div className="flex gap-1 items-center">
        <p>{icon}</p>
        <h3 className="text-white font-semibold text-sm text-start">{title}</h3>
      </div>
      <p className="text-grey-5 font-medium text-xs text-start">{text}</p>
    </button>
  );
};

export { FocusAssistantOption };
