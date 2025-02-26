"use client";

import { useEffect, useState } from "react";
import { Icon, Button } from "@/components/atoms";

const FooterAuth = () => {
  const [activeDocument, setActiveDocument] = useState<"privacy" | "tos" | "aup" | null>(null);

  useEffect(() => {
    if (activeDocument) {
      const existingScript = document.getElementById("getterms-embed-js");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "getterms-embed-js";
      script.src = "https://app.getterms.io/dist/js/embed.js";
      script.async = true;
      script.onload = () => {
        console.log("GetTerms script loaded");
      };
      document.body.appendChild(script);
    }
  }, [activeDocument]);

  return (
    <footer style={{
      zIndex: 1000000
    }} className="flex p-6 md:p-0 flex-col relative z-10 justify-center items-center w-full gap-4 mt-auto mb-6">
      <Icon type="FullLogoWhiteIcon" className="w-28 h-8 hidden md:block" />
      <div className="flex gap-3 justify-between items-center px-2 flex-wrap md:gap-6">
        <Button
          onClick={() => setActiveDocument("tos")}
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Terms of Service
        </Button>
        <Button
          onClick={() => setActiveDocument("privacy")}
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Privacy Policy
        </Button>
        <Button
          onClick={() => setActiveDocument("aup")}
          className="underline text-sm !font-medium underline-offset-4 p-0"
          variant="link"
        >
          Acceptable Use Policy
        </Button>
      </div>

      {activeDocument && (
        <div style={{
          zIndex: 1000000
        }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div style={{
            zIndex: 1000000
          }} className="bg-white !z-[1000] rounded-lg p-6 w-11/12 max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setActiveDocument(null)}
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {activeDocument === "tos"
                ? "Terms of Service"
                : activeDocument === "privacy"
                  ? "Privacy Policy"
                  : "Acceptable Use Policy"}
            </h2>
            <div
              className="getterms-document-embed max-h-[80vh] overflow-auto"
              data-getterms="Vriik"
              data-getterms-document={activeDocument}
              data-getterms-lang="en-us"
              data-getterms-mode="direct"
            ></div>
          </div>
        </div>
      )}
    </footer>
  );
};

export { FooterAuth };
