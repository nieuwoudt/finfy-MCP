"use client";
import { SuggestedBox } from "@/components/atoms";
import { useAppSelector } from "@/lib/store/hooks";

const HomeSuggestBoxes = () => {
  const suggest = useAppSelector((state) => state.suggest.suggest);
  return (
    <div className="w-full mt-3 p-1 overflow-hidden flex-wrap flex gap-3">
      {suggest.map((item: any) => (
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
