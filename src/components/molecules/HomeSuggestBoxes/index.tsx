"use client";
import { SuggestedBox } from "@/components/atoms";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const HomeSuggestBoxes = ({ isMobile = false }: { isMobile?: boolean }) => {
  const suggest = useAppSelector((state) => state.suggest.suggest);

  return (
    <div
      className={cn(
        "w-full mt-3 p-1 flex gap-3",
        isMobile
          ? "flex-row overflow-x-auto min-h-[230px] overflow-y-hidden whitespace-nowrap"
          : "flex-wrap overflow-y-auto max-h-[calc(100vh-350px)]"
      )}
      style={{
        maxHeight: isMobile ? "calc(100vh - 150px)" : undefined,
      }}
    >
      {suggest.map((item: any) => (
        <div key={item.label} className={cn("flex-shrink-0", isMobile ? "min-h-[136px]" : "")}> {/* Встановлення фіксованої висоти і ширини */}
          <SuggestedBox
            content={item.content}
            icon={item.icon}
            label={item.label}
          />
        </div>
      ))}
    </div>
  );
};

export { HomeSuggestBoxes };
