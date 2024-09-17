"use client";

import { DropdownMenu, Icon } from "@/components/atoms";

const DropDownModal = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <div onClick={() => console.log("Dropdown triggered!")}></div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-navy-25 border-navy-5 text-white">
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item className="flex hover:bg-navy-5 items-center w-full gap-4">
            <Icon type="ShareIcon" className="size-4 text-grey-15" />
            <p>Share</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex hover:bg-navy-5 items-center w-full gap-4">
            <Icon type="PenIcon" className="size-4 text-grey-15" />
            <p>Rename</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex hover:bg-navy-5 items-center w-full gap-4">
            <Icon type="InboxIcon" className="size-4 text-grey-15" />
            <p>Archive</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex hover:bg-navy-5 items-center w-full gap-4 text-red-500">
            <Icon type="DeleteIcon" className="size-4" />
            <p>Delete</p>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export { DropDownModal };
