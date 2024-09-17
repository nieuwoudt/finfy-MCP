import { SuggestedBox } from "@/components/atoms";
import { fakeSuggestionData } from "./index.constants";

const HomeSuggestBoxes = () => {
  return (
    <div className="w-full mt-3 p-1 overflow-hidden flex-wrap flex gap-3">
      {fakeSuggestionData.map((item) => (
        <SuggestedBox
          key={item.label}
          content={item.content}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </div>
  );
};

export { HomeSuggestBoxes };
