import { Select } from "@/components/atoms";

const ThemeSelector = ({ placeholder }: { placeholder: string }) => {
  return (
    <Select>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content className="bg-navy-25 text-white">
        <Select.Item value="light">Light</Select.Item>
        <Select.Item value="dark">Dark</Select.Item>
        <Select.Item value="system">System</Select.Item>
      </Select.Content>
    </Select>
  );
};

export { ThemeSelector };
