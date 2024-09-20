"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  maxFiles?: number;
  name: string;
  onSubmit: (files: { [key: string]: (Blob | MediaSource)[] }) => void;
}

const DropzoneComponent = (props: DropzoneProps) => {
  const { maxFiles = 1, name, onSubmit } = props;
  const [files, setFiles] = useState<any>([]);

  const onDrop = useCallback((acceptedFiles: (Blob | MediaSource)[]) => {
    setFiles([...files, ...acceptedFiles]);
    const previewFiles = acceptedFiles.map((file: Blob | MediaSource) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
  }, []);

  useEffect(() => {
    if (onSubmit && files.length) {
      onSubmit({ [name]: files });
      setFiles([]);
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "drop-zone-border rounded-md w-full justify-center items-center flex py-6"
      )}
    >
      <input {...getInputProps()} />
      <span className="text-2xl font-semibold text-white">
        <Icon type="DocumentIcon" className="w-6 h-6 stroke-white" />
        Drop files to begin upload, or browse.
      </span>
    </div>
  );
};

export { DropzoneComponent };
