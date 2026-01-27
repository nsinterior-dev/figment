import * as React from "react"

import { cn } from "@/lib/utils"

interface DropZoneProps extends React.ComponentProps<"div"> {
  isDragging?: boolean
  onFilesDrop?: (files: FileList) => void
}

function DropZone({
  className,
  isDragging,
  onFilesDrop,
  children,
  ...props
}: DropZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (onFilesDrop && e.dataTransfer.files.length > 0) {
      onFilesDrop(e.dataTransfer.files)
    }
  }

  return (
    <div
      data-slot="dropzone"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        // Base
        "border-2 border-dashed rounded-lg p-8",
        "text-center cursor-pointer transition-colors",
        // States
        isDragging
          ? "border-accent bg-accent/20"
          : "border-border hover:border-foreground/30 hover:bg-secondary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { DropZone }
