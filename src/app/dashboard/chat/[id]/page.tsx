import { FinancialTab } from "@/components/organisms";
import { FC } from "react";

interface ChatPageProps {
  params: {
    id: string;
  };
}

const ChatPage: FC<ChatPageProps> = ({ params }) => {
  return (
    <div className="bg-navy-25 w-full p-10 flex flex-col h-screen">
      <FinancialTab />
    </div>
  );
};

export default ChatPage;
