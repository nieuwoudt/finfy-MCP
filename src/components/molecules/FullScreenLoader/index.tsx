"use client";

import { Loader } from "@/components/atoms";
import { useChat } from "@/hooks";
import React, { FC } from "react";

interface FullScreenLoaderProps {}

const FullScreenLoader: FC<FullScreenLoaderProps> = () => {
  const { loading } = useChat();

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-10 backdrop-blur-lg">
      <Loader />
    </div>
  );
};

export { FullScreenLoader };
