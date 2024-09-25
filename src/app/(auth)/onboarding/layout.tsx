import { FooterAuth } from "@/components/molecules";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Finfy",
  description: "Chat",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="bg-purple-15 min-h-screen flex flex-col w-full">
      <div className="flex-1 flex justify-center items-center p-6">{children}</div>
      <FooterAuth  />
    </main>
  );
}
