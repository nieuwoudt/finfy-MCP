import { ChatMessageInput } from "@/components/molecules";
import { ActionButtonsGroup } from "@/components/organisms";

const AssistInput = () => {
  return (
    <div className="flex flex-col fixed left-0 right-0 bottom-0 md:left-auto md:right-auto md:bottom-auto md:relative">
      <div className="w-full pt-1 md:p-2 bottom-0 absolute bg-navy-15 md:bg-transparent">
        <ActionButtonsGroup />
        <ChatMessageInput />
      </div>
    </div>
  );
};

export { AssistInput };
