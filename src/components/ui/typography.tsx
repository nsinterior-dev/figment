import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Heading component
const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    level: {
      1: "text-4xl font-bold",
      2: "text-3xl font-bold",
      3: "text-2xl",
      4: "text-xl",
      5: "text-lg",
      6: "text-base",
    },
  },
  defaultVariants: {
    level: 1,
  },
})

interface HeadingProps
  extends React.ComponentProps<"h1">,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

function Heading({ className, level = 1, as, ...props }: HeadingProps) {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements)
  return (
    <Component
      data-slot="heading"
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  )
}

// Text component
const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent",
      destructive: "text-destructive",
      success: "text-success",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
    color: "default",
    weight: "normal",
  },
})

interface TextProps
  extends React.ComponentProps<"p">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div"
}

function Text({
  className,
  size,
  color,
  weight,
  as: Component = "p",
  ...props
}: TextProps) {
  return (
    <Component
      data-slot="text"
      className={cn(textVariants({ size, color, weight }), className)}
      {...props}
    />
  )
}

// Code component (inline)
function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="code"
      className={cn(
        "font-mono text-sm",
        "bg-muted px-1.5 py-0.5 rounded",
        className
      )}
      {...props}
    />
  )
}

// Label component
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export {
  Heading,
  headingVariants,
  Text,
  textVariants,
  Code,
  Label,
}
