import { Icon } from "@/components/atoms";
import { ActionButton, FocusAssistantPopover } from "@/components/molecules";
import { FC } from "react";

const ActionButtonsGroup: FC = () => {
  return (
    <nav className="flex text-grey-15 gap-2 mb-2">
      <FocusAssistantPopover>
        <ActionButton
          Icon={
            <Icon
              type="SearchIcon"
              className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
            />
          }
          text={"Focus"}
        />
      </FocusAssistantPopover>
      <ActionButton
        Icon={
          <Icon
            type="UserSolidIcon"
            className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
          />
        }
        text={"Link Accounts"}
      />
      <ActionButton
        Icon={
          <Icon
            type="PaperClipIcon"
            className="fill-purple-15 group-hover:fill-white h-3.5 w-5"
          />
        }
        text={"Attach"}
      />
    </nav>
  );
};

export { ActionButtonsGroup };
