import { Button, Icon } from "@/components/atoms";

const ButtonTemplates = () => {
  return (
    <div className="flex">
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="MicroChipIcon" className="size-4 mr-1" />
        System
      </Button>
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="SunIcon" className="size-4 mr-1" />
        Light
      </Button>
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="MoonIcon" className="size-4 mr-1" />
        Dark
      </Button>
    </div>
  );
};

export { ButtonTemplates };
