import { Button, Field, Icon } from "@/components/atoms";

const Chat = () => {
  return (
    <div className="chat-input">
      <Field
        full
        className="h-full mr-2 bg-navy-15 focus:outline-none"
        classes={{
          containerInput: "!border-none",
        }}
        placeholder="Ask anything..."
      />
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="co-pilot-btn !p-0 lg:!p-1 !w-6 lg:!w-28"
        >
          <Icon type="BsStarsIcon" />
          <span className="hidden lg:flex gap-1 items-center">
            Co-pilot
            <div className="p-2 bg-navy-25 rounded-full" />
          </span>
        </Button>

        <Button size="xl">
          <Icon type="ArrowRightIcon" className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export { Chat };
