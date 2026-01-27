import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const panelVariants = cva(
  "rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-card border border-border",
        subtle: "bg-muted",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

function Panel({
  className,
  variant,
  padding,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof panelVariants>) {
  return (
    <div
      data-slot="panel"
      className={cn(panelVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

export { Panel, panelVariants }
