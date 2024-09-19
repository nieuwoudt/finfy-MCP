"use client";

import { useRef, useEffect } from "react";

const useAutoResizeTextArea = (dependencies = []) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      console.log(textAreaRef.current, "textAreaRef.current");
    }
  }, [textAreaRef, ...dependencies]);

  return textAreaRef;
};

export { useAutoResizeTextArea };
