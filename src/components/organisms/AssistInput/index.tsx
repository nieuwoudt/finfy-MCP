import { ChatMessageInput, HomeAssistButtons } from "@/components/molecules";

const AssistInput = () => {
  return (
    <div className="flex flex-col relative">
      <div className="w-full p-2 bottom-0 absolute">
        <HomeAssistButtons />
        <ChatMessageInput />
      </div>
    </div>
  );
};

export { AssistInput };
