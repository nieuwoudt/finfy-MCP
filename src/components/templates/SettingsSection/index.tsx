"use client";

import { SeparatorLine } from "@/components/atoms";
import { SettingsTab } from "@/components/organisms";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab) {
      // Remove any existing GetTerms script
      const existingScript = document.getElementById("getterms-embed-js");
      if (existingScript) existingScript.remove();

      // Dynamically load the GetTerms embed script
      const script = document.createElement("script");
      script.id = "getterms-embed-js";
      script.type = "text/javascript";
      script.src = "https://app.getterms.io/dist/js/embed.js";
      document.body.appendChild(script);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "privacy":
        return (
          <div
            className="getterms-document-embed"
            data-getterms="Vriik"
            data-getterms-document="privacy"
            data-getterms-lang="en-us"
            data-getterms-mode="direct"
          ></div>
        );
      case "tos":
        return (
          <div
            className="getterms-document-embed"
            data-getterms="Vriik"
            data-getterms-document="tos"
            data-getterms-lang="en-us"
            data-getterms-mode="direct"
          ></div>
        );
      case "aup":
        return (
          <div
            className="getterms-document-embed"
            data-getterms="Vriik"
            data-getterms-document="aup"
            data-getterms-lang="en-us"
            data-getterms-mode="direct"
          ></div>
        );
      default:
        return (
          <p className="text-white">Select a policy to view its details.</p>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow sticky top-0 bg-navy-25">
        <h1 className="font-semibold px-10 pt-5 text-white text-2xl">
          Settings
        </h1>
        <SeparatorLine />
      </div>
      <div className="flex items-start justify-center w-full h-full text-grey-15 text-sm">
        <div className=" flex flex-col">
          <SettingsTab />
        </div>
      </div>
      <footer className="flex gap-5 items-center justify-center text-sm text-grey-15 py-4">
        <div className="flex gap-5 my-5">
          <Dialog.Root onOpenChange={(isOpen) => {
            if (!isOpen) {
              setActiveTab(null);
            }
          }}>
            <Dialog.Trigger asChild onClick={() => setActiveTab("tos")}>
              <p className="hover:text-white cursor-pointer">
                Terms of Service
              </p>
            </Dialog.Trigger>
            <Dialog.Trigger asChild onClick={() => setActiveTab("aup")}>
              <p className="hover:text-white cursor-pointer">Usage Policy</p>
            </Dialog.Trigger>
            <Dialog.Trigger asChild onClick={() => setActiveTab("privacy")}>
              <p className="hover:text-white cursor-pointer">Privacy Policy</p>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-[80%] max-w-lg h-[400px] overflow-y-scroll">
                <Dialog.Close className="absolute top-2 right-2">
                  ✕
                </Dialog.Close>
                <div>{renderContent()}</div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </footer>
    </div>
  );
};

export { SettingsSection };
