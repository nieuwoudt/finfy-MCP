import { ReactNode } from "react";
import Head from "next/head";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import clsx from "clsx";
import { FullScreenLoader, Initializer } from "@/components/molecules";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finfy",
  description: "Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <StoreProvider>
        <body className={clsx(inter.className, "min-h-screen")}>
          <FullScreenLoader />
          {children}
          <Toaster />
          <Initializer />
        </body>
      </StoreProvider>
    </html>
  );
}
