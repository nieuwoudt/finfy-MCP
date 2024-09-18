import { Button, Icon } from "@/components/atoms";

const ButtonTemplates = () => {
  return (
    <div className="flex">
      <Button variant="ghost" className="text-xs shadow-none p-2">
        <Icon
          type="MicroChipIcon"
          className="w-4 h-4  mr-1 stroke-grey-15 group-hover:stroke-white"
        />
        System
      </Button>
      <Button variant="ghost" className="text-xs shadow-none p-2">
        <Icon
          type="SunIcon"
          className="w-4 h-4 mr-1 group-hover:stroke-white"
        />
        Light
      </Button>
      <Button variant="ghost" className="text-xs shadow-none p-2">
        <Icon
          type="MoonIcon"
          className="w-4 h-4 mr-1 group-hover:stroke-white"
        />
        Dark
      </Button>
    </div>
  );
};

export { ButtonTemplates };
