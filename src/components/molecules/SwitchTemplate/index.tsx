import { Label, Switch } from "@/components/atoms";
import { FC } from "react";

interface SwitchTemplateProps {
  id?: string;
  label?: string;
}

const SwitchTemplate: FC<SwitchTemplateProps> = ({ label, id }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={id}>{label}</Label>
      <Switch defaultChecked id={id} className="border-navy-5 border " />
    </div>
  );
};

export { SwitchTemplate };
