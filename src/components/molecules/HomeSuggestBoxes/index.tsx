"use client";
import { SuggestedBox } from "@/components/atoms";
import { useAppSelector } from "@/lib/store/hooks";

const HomeSuggestBoxes = () => {
  const suggest = useAppSelector((state) => state.suggest.suggest);
  return (
    <div className="w-full max-w-[500px] max-h-[calc(100vh-350px)] overflow-y-auto mt-3 p-1 flex flex-wrap overflow-hidden gap-3">
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
