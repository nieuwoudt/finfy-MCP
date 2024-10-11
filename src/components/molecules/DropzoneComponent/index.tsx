"use client";

import { Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { Classes } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  maxFiles?: number;
  name: string;
  onSubmit: (files: { [key: string]: (Blob | MediaSource)[] }) => void;
  classes?: Classes;
}

const DropzoneComponent = (props: DropzoneProps) => {
  const { maxFiles = 1, name, onSubmit, classes } = props;
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
        "drop-zone-border rounded-md w-full justify-center items-center flex py-6",
        classes?.wrapper
      )}
    >
      <input {...getInputProps()} />
      <span className="text-2xl font-semibold text-white flex items-center gap-2">
        <Icon type="DocumentIcon" className="w-6 h-6 stroke-white" />
        Drop files to begin upload, or <span className="text-purple-15">browse</span>.
      </span>
    </div>
  );
};

export { DropzoneComponent };
