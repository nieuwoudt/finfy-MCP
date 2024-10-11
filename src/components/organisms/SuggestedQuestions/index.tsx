"use client";

import { SuggestedQuestion } from "@/components/molecules";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const SuggestedQuestions = () => {
  const suggests = useSelector((state: RootState) => state.chat.suggests);
  if (!suggests) {
    return null;
  }
  const { simple, open_ended } = suggests;
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 absolute w-full px-3 bottom-[105%]">
      <SuggestedQuestion question={open_ended.at(0)} />
      <SuggestedQuestion question={simple.at(0)} />
    </div>
  );
};

export { SuggestedQuestions };
