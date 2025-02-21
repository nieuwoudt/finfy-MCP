"use client";

import { Popover } from "@/components/atoms";
import { FC, PropsWithChildren, useEffect } from "react";
import { FocusAssistantOption } from "@/components/molecules";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchFocusSuggests } from "@/lib/store/features/suggest/suggestSlice";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks";

interface FocusAssistantPopoverProps extends PropsWithChildren {}

const FocusAssistantPopover: FC<FocusAssistantPopoverProps> = ({
  children,
}) => {
  const focusData = useAppSelector((state) => state.suggest.focusSuggests);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.suggest.loading);
  const error = useAppSelector((state) => state.suggest.error);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFocusSuggests({ userId: user.id, provider: "plaid" })); //TODO un-hide suggests questions
    }  }, []);

  // if (loading) return <div><Loader2 className="animate-spin w-3 h-3" />Focus</div>;
  if (error) return <div></div>;
  return (
    <Popover> 
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content side="top" align="start" className="mb-4 max-w-3xl">
        <Popover.Header className="mb-6">
          <span>Focus Assistant</span>
        </Popover.Header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {focusData.map((item: any, index: number) => {
            return (
              <FocusAssistantOption
                title={item.title}
                text={item.text}
                key={index}
                suggest={item.suggest}
                icon={item.icon}
              />
            );
          })}
        </div>
      </Popover.Content>
    </Popover>
  );
};

export { FocusAssistantPopover };
