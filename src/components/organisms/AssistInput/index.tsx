import { ChatMessageInput } from "@/components/molecules";
import { ActionButtonsGroup } from "@/components/organisms";

const AssistInput = () => {
  return (
    <div className="flex flex-col relative">
      <div className="w-full p-2 bottom-0 absolute">
        <ActionButtonsGroup />
        <ChatMessageInput />
      </div>
    </div>
  );
};

export { AssistInput };
