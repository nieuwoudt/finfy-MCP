import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex w-full min-h-screen font-inter">
      <div className="flex-grow flex bg-navy-25 p-4">{children}</div>
    </main>
  );
}
