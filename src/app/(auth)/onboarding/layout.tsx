import { FooterAuth } from "@/components/molecules";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="bg-purple-15 min-h-screen flex flex-col w-full">
      <div className="flex-1 flex justify-center items-center">
      {children}
      </div>
      <FooterAuth />
    </main>
  );
}
