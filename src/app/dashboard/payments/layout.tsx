import { LayoutDashboard } from "@/layout";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <LayoutDashboard>{children}</LayoutDashboard>;
}
