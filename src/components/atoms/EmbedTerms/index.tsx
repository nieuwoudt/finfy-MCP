"use client";

import { FC, useEffect } from "react";

interface EmbedTermsProps {
  documentType: string;
}

const EmbedTerms: FC<EmbedTermsProps> = ({ documentType }) => {
  useEffect(() => {
    const id = `getterms-embed-${documentType}`;
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.src = "https://app.getterms.io/dist/js/embed.js";
      script.id = id;
      document.body.appendChild(script);
    }
  }, [documentType]);

  return (
    <div
      className="getterms-document-embed text-white"
      data-getterms="Vriik"
      data-getterms-document={documentType}
      data-getterms-lang="en-us"
      data-getterms-mode="direct"
    />
  );
};

export { EmbedTerms };
