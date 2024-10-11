import { Sidebar } from "@/components/organisms";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex w-full min-h-screen font-inter">
      <Sidebar />
      <div className="flex-grow flex bg-navy-25">{children}</div>
    </main>
  );
}
