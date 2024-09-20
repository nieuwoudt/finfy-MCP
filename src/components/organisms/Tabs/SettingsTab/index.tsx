"use client";

import { Tab, Icon } from "@/components/atoms";
import { ManageProfileTab } from "./ManageProfileTab";
import { DocUploadTab } from "./DocUploadTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { SupportTab } from "./SupportTab";
import { PersonalizeTab } from "./PersonalizeTab";

const SettingsTab = () => {
  return (
    <Tab defaultValue="manage" className="px-4">
      <Tab.List className="mb-12 flex-wrap">
        <Tab.Trigger value="manage" className="gap-1 items-center group">
          <Icon
            type="UserIcon"
            className="w-6 h-6 stroke-inherit group-hover:stroke-white"
          />
          Manage Profile
        </Tab.Trigger>
        <Tab.Trigger value="subscriptions" className="gap-1 items-center group">
          <Icon type="DollarIcon" className="w-6 h-6 stroke-transparent fill-inherit group-hover:fill-white" />
          Subscriptions
        </Tab.Trigger>
        <Tab.Trigger value="support" className="gap-1 items-center group">
          <Icon type="SupportIcon" className="w-6 h-6 stroke-transparent fill-inherit group-hover:fill-white" />
          Support
        </Tab.Trigger>
        <Tab.Trigger value="personalization" className="gap-1 items-center group">
          <Icon type="SparkleIcon" className="w-6 h-6 stroke-inherit group-hover:stroke-white" />
          Personalization
        </Tab.Trigger>
        <Tab.Trigger value="upload" className="gap-1 items-center group">
          <Icon type="DocumentIcon" className="w-6 h-6 stroke-inherit group-hover:stroke-white" />
          Document Upload
        </Tab.Trigger>
      </Tab.List>
      <Tab.Content value="manage">
        <ManageProfileTab />
      </Tab.Content>
      <Tab.Content value="subscriptions">
        <SubscriptionTab />
      </Tab.Content>
      <Tab.Content value="support">
        <SupportTab />
      </Tab.Content>
      <Tab.Content value="personalization">
        <PersonalizeTab />
      </Tab.Content>
      <Tab.Content value="upload">
        <DocUploadTab />
      </Tab.Content>
    </Tab>
  );
};

export { SettingsTab };
