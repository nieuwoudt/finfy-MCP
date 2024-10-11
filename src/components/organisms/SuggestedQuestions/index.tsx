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
    <div className="absolute w-full px-3 bottom-[110%] md:bottom-[105%]">
      <h4 className="text-white font-semibold text-2xl mb-4">Related</h4>
      <div className="flex gap-2 md:gap-4 overflow-auto w-full scrollbar-hide">
        {[...simple, ...open_ended].map((question) => {
          return <SuggestedQuestion key={question} question={question} />;
        })}
      </div>
    </div>
  );
};

export { SuggestedQuestions };
