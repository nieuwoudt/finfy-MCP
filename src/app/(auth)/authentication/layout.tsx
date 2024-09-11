import { LayoutLogin } from "@/layout";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <LayoutLogin>{children}</LayoutLogin>;
}
