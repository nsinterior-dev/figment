"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import useFileUpload from "../../hooks/useFileUpload";
import { Button, DropZone, Panel, Text } from "@/components/ui";

export const UploadZone = () => {
  const { preview, error, handleFileSelect, clearFile } = useFileUpload();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => inputRef.current?.click();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const onFileDrop = (files: FileList) => {
    setIsDragging(false);
    if (files[0]) handleFileSelect(files[0]);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onSelectFile}
      />

      {preview ? (
        <Panel padding="lg" className="flex flex-col items-center gap-4">
          <Image src={preview} width={200} height={200} alt="Preview" className="rounded-lg" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={clearFile}>Clear</Button>
            <Button variant="outline" onClick={openFilePicker}>Change File</Button>
          </div>
        </Panel>
      ) : (
        <DropZone
          isDragging={isDragging}
          onClick={openFilePicker}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onFilesDrop={onFileDrop}
        >
          <Text color="muted">Drop an image here, or click to browse</Text>
          <Text color="muted" size="sm" className="mt-2">PNG, JPG, WebP up to 10MB</Text>
        </DropZone>
      )}

      {error && <Text color="destructive" size="sm" className="mt-2">{error}</Text>}
    </div>
  );
};
