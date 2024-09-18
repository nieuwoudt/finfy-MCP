"use client";

import { Tab, Icon } from "@/components/atoms";
import { ManageProfileTab } from "./ManageProfileTab";
import { DocUploadTab } from "./DocUploadTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { SupportTab } from "./SupportTab";
import { PersonalizeTab } from "./PersonalizeTab";

const SettingsTab = () => {
  return (
    <Tab defaultValue="manage">
      <Tab.List>
        <Tab.Trigger value="manage" className="gap-1 items-center">
          <Icon type="UserIcon" />
          Manage Profile
        </Tab.Trigger>
        <Tab.Trigger value="subscriptions" className="gap-1 items-center">
          <Icon type="DollarIcon" />
          Subscriptions
        </Tab.Trigger>
        <Tab.Trigger value="support" className="gap-1 items-center">
          <Icon type="SupportIcon" />
          Support
        </Tab.Trigger>
        <Tab.Trigger value="personalization" className="gap-1 items-center">
          <Icon type="SparkleIcon" className="w-6 h-6 stroke-white" />
          Personalization
        </Tab.Trigger>
        <Tab.Trigger value="upload" className="gap-1 items-center">
          <Icon type="DocumentIcon" />
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
