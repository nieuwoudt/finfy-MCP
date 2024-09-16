import { Sidebar } from "@/components/organisms";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex w-full h-screen font-inter">
      <Sidebar />
      <div className="flex-grow flex">{children}</div>
    </main>
  );
}
