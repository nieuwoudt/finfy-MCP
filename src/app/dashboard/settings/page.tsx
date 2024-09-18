import { SettingsPage } from "@/components/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setting | Finfy",
  description: "Chat",
};

const Settings = () => {
  return <SettingsPage />;
};

export default Settings;
