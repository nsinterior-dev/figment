import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "flex h-9 w-full rounded-md border bg-background px-3 py-2",
        "text-sm text-foreground",
        "placeholder:text-muted-foreground",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Border states
        "border-input hover:border-gray-8",
        // Focus
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        // Error state (aria-invalid)
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
