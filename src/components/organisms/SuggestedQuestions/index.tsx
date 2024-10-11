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
    <div className="absolute w-full px-3 bottom-[105%]">
      <div className="flex gap-2 md:gap-4 overflow-auto w-full custom-scrollbar">
        {[...simple, ...open_ended].map((question) => {
          return <SuggestedQuestion key={question} question={question} />;
        })}
      </div>
    </div>
  );
};

export { SuggestedQuestions };
