"use client";
import { Accordion, Icon } from "@/components/atoms";
import {
  UserAvatar,
  PersonalizePop,
  ButtonTemplates,
} from "@/components/molecules";
import { signOutAction } from "@/lib/supabase/actions";
import Link from "next/link";
import { useState } from "react";

const UserSettings = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="menu-button-btn flex space-x-2 items-center">
      <Accordion
        onValueChange={(value) => setOpen(Boolean(value))}
        type="single"
        collapsible
        className="w-full "
      >
        <Accordion.Item value="item-1">
          <Accordion.Trigger>
            <UserAvatar className="rounded-sm" />
            Niewoudt Gresse
          </Accordion.Trigger>
          <Accordion.Content className="mt-5 justify-start">
            <p className="text-grey-15 text-xs mb-2">Appearance</p>
            <ButtonTemplates />
            <p className="text-grey-15 text-xs my-2">Quick settings</p>
            <div className="flex items-center cursor-pointer group hover:text-grey-5 mb-1">
              <Icon
                type="SparkleIcon"
                className="w-4 h-4 stroke-white group-hover:stroke-grey-5 mr-1"
              />
              <PersonalizePop />
            </div>
            <Link
              href="settings"
              className="flex items-center  text-sm cursor-pointer group hover:text-grey-5 mb-1"
            >
              <Icon
                type="GearIcon"
                className="fill-white min-w-4 h-4 group-hover:fill-grey-5 mr-1"
              />
              All settings
            </Link>
            <button
              onClick={signOutAction}
              className="flex items-center text-sm cursor-pointer group hover:text-grey-5"
            >
              <Icon
                type="LoginIcon"
                className="w-4 h-4 stroke-white group-hover:stroke-grey-5 mr-1"
              />
              Log Out
            </button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      {!open && <Icon type="GearIcon" className="min-w-4 h-4  fill-white" />}
    </div>
  );
};

export { UserSettings };
