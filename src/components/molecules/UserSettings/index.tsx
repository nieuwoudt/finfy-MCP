"use client";
import { Accordion, Icon } from "@/components/atoms";
import {
  UserAvatar,
  PersonalizePop,
  ButtonTemplates,
} from "@/components/molecules";
import Link from "next/link";

const UserSettings = () => {
  return (
    <Accordion type="single" collapsible className="w-full ">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <UserAvatar className="rounded-sm" />
          Niewoudt Gresse
        </Accordion.Trigger>
        <Accordion.Content className="mt-5 justify-start">
          <p className="text-grey-15 text-xs">Appearance</p>
          <ButtonTemplates />
          <p className="text-grey-15 text-xs my-2">Quick settings</p>
          <div className="flex items-center cursor-pointer hover:text-grey-5 mb-1">
            <Icon type="SparkleIcon" className="w-4 h-4 fill-grey-15 mr-1" />
            <PersonalizePop />
          </div>
          <Link
            href="/settings"
            className="flex items-center cursor-pointer hover:text-grey-5 mb-1"
          >
            <Icon type="GearIcon" className="size-4 text-grey-15 mr-1" />
            All settings
          </Link>
          <button className="flex items-center cursor-pointer hover:text-grey-5">
            <Icon type="LoginIcon" className="size-4 stroke-grey-15 mr-1" />
            Log Out
          </button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

export { UserSettings };
