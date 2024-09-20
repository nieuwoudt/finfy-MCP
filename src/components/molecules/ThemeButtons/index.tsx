import { Button, Icon } from "@/components/atoms";

const ThemeButtons = () => {
  return (
    <div className="flex">
      <Button variant="ghost" className="text-xs shadow-none !rounded-sm p-2">
        <Icon
          type="MicroChipIcon"
          className="w-4 h-4  mr-1 stroke-grey-15 group-hover:stroke-white"
        />
        System
      </Button>
      <Button variant="ghost" className="text-xs shadow-none !rounded-sm p-2">
        <Icon
          type="SunIcon" 
          className="w-4 h-4 mr-1 stroke-grey-15 group-hover:stroke-white"
        />
        Light
      </Button>
      <Button variant="ghost" className="text-xs shadow-none !rounded-sm p-2">
        <Icon
          type="MoonIcon"
          className="w-4 h-4 mr-1 fill-grey-15 group-hover:fill-white"
        />
        Dark
      </Button>
    </div>
  );
};

export { ThemeButtons };
