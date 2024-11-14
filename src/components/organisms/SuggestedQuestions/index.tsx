"use client";

import { SuggestedQuestion } from "@/components/molecules";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/store/hooks";
import { useSelector } from "react-redux";

const SuggestedQuestions = () => {
//   const suggests = {
//     "simple": [
//         "What is my average monthly spending on general services?",
//         "How much have I spent on entertainment over the past three months?",
//         "Can you show me a breakdown of my bank fees?",
//         "What is the total income I have received in the last three months?",
//         "How does my spending compare between entertainment and general services?"
//     ],
//     "open_ended": [
//         "What factors influence my spending on entertainment, and could I find ways to reduce it?",
//         "Are there any unexpected spikes in my bank fees that I should be aware of, and how can I manage them better?",
//         "In what areas of my general services spending could I potentially save money without impacting my daily life?",
//         "How consistent is my income from freelance work, and what steps can I take to increase my earnings?",
//         "Reflecting on my recent transactions, do I notice any patterns that could indicate overspending or under-budgeting in certain categories?"
//     ]
// };

  const suggests = useSelector((state: RootState) => state.chat.suggests);
  if (!suggests) {
    return null;
  }
  const { simple, open_ended } = suggests;

  if (!simple?.length || !open_ended?.length) {
    return null;
  }
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
