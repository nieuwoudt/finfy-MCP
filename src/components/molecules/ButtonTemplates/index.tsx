import { Button, Icon } from "@/components/atoms";

const ButtonTemplates = () => {
  return (
    <div className="flex">
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="MicroChipIcon" className="w-4 h-4  mr-1 stroke-grey-15" />
        System
      </Button>
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="SunIcon" className="w-4 h-4 mr-1" />
        Light
      </Button>
      <Button variant="ghost" className="text-xs shadow-none">
        <Icon type="MoonIcon" className="w-4 h-4 mr-1" />
        Dark
      </Button>
    </div>
  );
};

export { ButtonTemplates };
