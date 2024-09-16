import { DashboardPage } from "@/components/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Finfy",
  description: "Chat",
};

const Dashboard = async () => {
  return <DashboardPage />;
};

export default Dashboard;
