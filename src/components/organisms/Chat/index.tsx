import { Button, Field, Icon } from "@/components/atoms";

const Chat = () => {
  return (
    <div className="chat-input">
      <Field
        className="h-full mr-2 border-none bg-navy-15 focus:outline-none"
        placeholder="Ask anything..."
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="co-pilot-btn">
          <Icon type="BsStarsIcon" />
          Co-pilot
          <div className="p-2 bg-navy-25 rounded-full" />
        </Button>

        <Button size="xl">
          <Icon type="ArrowRightIcon" className="size-4 text-white rotate-90" />
        </Button>
      </div>
    </div>
  );
};

export { Chat };
